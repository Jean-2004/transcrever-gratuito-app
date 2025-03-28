import React, { useState, useEffect, useRef } from 'react'

export default function HomePage(props) {
    const { darkMode, setAudioStream, setFile } = props

    const [recordingStatus, setRecordingStatus] = useState('inactive')
    const [audioChunks, setAudioChunks] = useState([])
    const [duration, setDuration] = useState(0)

    const mediaRecorder = useRef(null)

    const mimeType = 'audio/webm'

    async function startRecording() {
        let tempStream

        console.log('Start recording')

        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            tempStream = streamData

        } catch (err) {
            console.log(err.message)
            return
        }
        setRecordingStatus('recording')

        //create newMedia recorder instance using the stream
        const media  = new MediaRecorder(tempStream, {type: mimeType})

        mediaRecorder.current = media

        mediaRecorder.current.start()
        let localAudioChunks = []
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') {return}
            if (event.data.size === 0) {return}
            localAudioChunks.push(event.data)
        }
        setAudioChunks(localAudioChunks)
    }

    async function stopRecording() {
        setRecordingStatus('inactive')
        console.log('Stop recording')

        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, {type: mimeType})
            setAudioStream(audioBlob)
            setAudioChunks([])
            setDuration(0)
        }
    }

    useEffect(() => {
        if (recordingStatus === 'inactive') {return}

        const interval = setInterval(() => {
            setDuration(curr => curr + 1)
        }, 1000)

        return () => clearInterval(interval)
    })


  return (
    <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20'>
        <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>Transcição <span className={'bold ' + (darkMode ? 'text-purple-500' : 'text-blue-400')}>Grátis</span></h1>
        <h3 className='font-medium md:text-lg'>Gravar <span 
        className={darkMode ? 'text-purple-500' : 'text-blue-400'}>&rarr;</span> Transcrever <span 
        className={darkMode ? 'text-purple-500' : 'text-blue-400'}>&rarr;</span> Traduzir</h3>
        <button onClick={recordingStatus === 'recording' ? stopRecording : startRecording} 
        className={'flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-xl ' + (darkMode ? 'specialBtnDark' : '')}>
            <p className={darkMode ? 'text-purple-500' : 'text-blue-400'}>{recordingStatus === 'inactive' ? 'Gravar' : `Parar gravação`}</p>
            <div className='flex items-center gap-2'>
                {duration !== 0 && (
                    <p className='text-sm'>{duration}s</p>
                )}
                <i className={"fa-solid duration-200 fa-microphone " + (recordingStatus === 'recording' ? ' text-rose-300' : "")} ></i>
            </div>
        </button>
        <p className='text-base'>Ou <label className={'duration-200 ' + (darkMode ? 'text-purple-500 hover:text-purple-800' : 'text-blue-400 cursor-pointer hover:text-blue-600 ')}>Enviar 
        <input onChange={(e) => {
            const tempFile = e.target.files[0]
            setFile(tempFile)
        }} className='hidden' type="file" accept='.mp3,.wave' /></label> um arquivo mp3</p>
        <p className='italic text-slate-400'>Grátis agora, grátis para sempre</p>
    </main>
  )
}
