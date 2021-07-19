import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import {
  compressToUTF16 as encode,
  decompressFromUTF16 as decode
} from 'lz-string'

import CheapGlkOte from 'cheap-glkote'

import TextBuffer from './TextBuffer'
import GridBuffer from './GridBuffer'

import InputBox from './InputBox'
import Status from './Status'

import './player.css'

const INITIAL_STATUS = {
  stage: 'loading',
  details: ['Preparing']
}

const runMachine = ({ engine: Engine, file, handlers }) => {
  const vm = new Engine()
  const { glkInterface, sendFn } = CheapGlkOte(handlers)

  vm.prepare(file, glkInterface)
  vm.start()

  return { sendFn, instance: vm }
}

const Handlers = ({
  setStatus,
  setWindows,
  setCurrentWindowId,
  setInputType,
  setInbox
}) => ({
  onInit: _ => {
    setStatus({ stage: 'ready' })
  },
  /* */
  onUpdateWindows: windows => {
    setWindows(windows)
  },
  onUpdateInputs: data => {
    if (data.length === 0) return void null

    const {type, id} = data[0]
    setCurrentWindowId(id)
    setInputType(type)
  },
  onUpdateContent: inbox => {
    setInbox(inbox)
  },
  onDisable: _ => {
    setInputType(null)
  },
  /* */
  onFileNameRequest: (tosave, usage, _, setFileName) => {
    setFileName({
      usage,
      filename: prompt('Enter the filename')
    })
  },
  onFileRead: ({ filename }) => {
    const content = localStorage.getItem(`fake-fs/${filename}`)
    return decode(content)
  },
  onFileWrite: ({ filename }, content) => {
    localStorage.setItem(`fake-fs/${filename}`, encode(content))
  },
  /* */
  onExit: _ => {
    setInputType(null)
  }
})

export default function ({
  vmParts: { file, engine }, singleWindow
}) {
  const [status, setStatus] = useState(INITIAL_STATUS)

  const [windows, setWindows] = useState([])
  const [currentWindowId, setCurrentWindowId] = useState(null)
  const [inputType, setInputType] = useState(null)
  const [inbox, setInbox] = useState([])

  const [vm, setVm] = useState(null)
  const [sendMessage, setSendMessage] = useState(null)

  useEffect(() => {
    const vm = runMachine({
      engine,
      file,
      handlers: Handlers({
        setStatus,
        setWindows,
        setCurrentWindowId,
        setInputType,
        setInbox
      })
    })

    setVm(vm)
  }, [file, engine])

  useEffect(() => {
    setSendMessage(_ => vm
      ? vm.sendFn
      : null)
  }, [vm])

  const textWindow = inbox => currentWindow => {
    const props = {
      inbox,
      currentWindow
    }

    return ({
      'buffer': <TextBuffer {...props} />,
      'grid': <GridBuffer {...props} />
    })[currentWindow.type]
  }

  const byTop = (a, b) =>
    a.top - b.top

  return status.stage !== 'ready'
    ? (<Status {...status} />)
    : (<section className='ifplayer'>
        <section className='output'>{
          windows
            .sort(byTop)
            .filter(singleWindow
              ? ({id}) => id === currentWindowId
              : _ => true)
            .map(textWindow(inbox))}
        </section>
        <InputBox {...{
          inputType,
          windows,
          currentWindowId,
          sendMessage }} />
      </section>)
}
