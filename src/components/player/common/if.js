// import CheapGlkOte from 'cheap-glkote'
// import engine from 'emglken/src/tads.js'

// import { engineByFilename } from './engines'

// export const fetchGameFile = url => fetch(url)
//   .then(response => (console.log(response), response))
//   .then(response => response.blob())
//   .then(blob => new Response(blob).arrayBuffer())
//   .then(buffer => new Uint8Array(buffer))
//   .then(file => {
//     const { glkInterface, sendFn } = CheapGlkOte({
//       onUpdateContent: messages => console.log(messages)
//     })
//     window.send = sendFn

//     const vm = new engine()
//     vm.prepare(file, glkInterface)
//     vm.start()
//   })
//   .catch(console.log)