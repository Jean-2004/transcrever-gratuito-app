import { useState, useRef, useEffect } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import FileDisplay from './components/FileDisplay'
import Information from './components/Information'
import Transcribing from './components/Transcribing'
import { MessageTypes } from './utils/presets'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [file, setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)
  const [output, setOutput] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const isAudioAvailable = file || audioStream

  function handleDarkMode(){
    setDarkMode(!darkMode)
  }

  function handleAudioReset() {
    setFile(null)
    setAudioStream(null)
  }

  const worker = useRef(null)

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {
        type: 'module'
      })
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true)
          console.log('DOWLOADING')
          break;
        case 'LOADING':
          setLoading(true)
          console.log('LOADING')
          break;
        case 'RESULT':
          setOutput(e.data.results)
          console.log(e.data.results)
          break;
        case 'INFERENCE_DONE':
          setFinished(true)
          console.log("DONE")
          break;
      
      }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current.removeEventListener('message', onMessageReceived)
  }, [])

  async function readAudioFrom(file) {
    const sampling_rate = 16000
    const audioCTX = new AudioContext({sampleRate: sampling_rate})
    const response = await file.arrayBuffer()
    const decoded = await audioCTX.decodeAudioData(response)
    const audio = decoded.getChannelData(0)
    return audio
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) { return }

    let audio = await readAudioFrom(file ? file : audioStream)
    const model_name = 'openai/whisper-tiny.en'

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name
    })
  }

  return (
    <div className={'bg-gradient-to-r text-sm sm:text-base animation-200 transition-colors ' + (darkMode ? 'from-black to-gray-950 text-slate-500' : 'from-blue-50 to-transparent text-slate-700')}>
      <div className='flex flex-col max-w-[1000px] mx-auto w-full'>
        <section className='min-h-screen flex flex-col'>
          <Header darkMode={darkMode} />
          {output ? (
            <Information darkMode={darkMode} output={output} />
          ) : loading ? (
            <Transcribing darkMode={darkMode} />
          ) : isAudioAvailable ? (
          <FileDisplay darkMode={darkMode} handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} file={file} audioStream={audioStream} />
          ) : (<HomePage darkMode={darkMode} setFile={setFile} setAudioStream={setAudioStream} />)}
          <button onClick={handleDarkMode} className='pb-4 mx-auto'>
            {darkMode ? <i title='Modo Claro' className="text-4xl fa-solid fa-sun"></i> : <i title='Modo Escuro' className="text-4xl fa-solid fa-moon"></i>}
          </button>
        </section>
        <footer></footer>
      </div>
    </div>
  )
}

export default App
