import React, { useState, useEffect, useRef } from 'react'
import Transcription from './Transcription'
import Translation from './Translation'

export default function Information(props) {
    const { darkMode, output } = props
    const [tab, setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [toLanguage, setToLanguage] = useState('Select language')
    const [translating, setTranslating] = useState(null)

    const worker = useRef()

    useEffect(() => {
        if (!worker.current) {
          worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
            type: 'module'
          })
        }

    const onMessageReceived = async (e) => {
            switch (e.data.status) {
            case 'initiate':
                console.log('DOWLOADING')
                break;
            case 'progress':
                console.log('LOADING')
                break;
            case 'update':
                setTranslation(e.data.output)
                console.log(e.data.output)
                break;
            case 'complete':
                setTranslating(false)
                console.log("DONE")
                break;
            }
    }

    worker.current.addEventListener('message', onMessageReceived)
    return () => worker.current.removeEventListener('message', onMessageReceived)
})

     const textElement = tab === 'transcription' ? output.map(val => val.text) : translation || 'No translation'


    function handleCopy() {
        navigator.clipboard.writeText(textElement)
    }

    function handleDownload() {
        const element = document.createElement('a')
        const file = new Blob([textElement], {type: 'text/plain'})
        element.href = URL.createObjectURL(file)
        element.download = `transcrevegratis_${new Date().toString()}.txt`
        document.body.appendChild(element)
        element.click()
    }

    function generateTranslation() {
        if (translating || toLanguage == 'Select language') {
            return
        }
        setTranslating(true)

        worker.current.postMessage({
            text: output.map(val => val.text),
            src_lang:'eng_Latn',
            tgt_lang: toLanguage
        })
    }


    return (
    <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto'>
        <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap'>Sua <span className={'bold ' + (darkMode ? 'text-purple-800' : 'text-blue-300')}>Transcrição</span></h1>

        <div className='grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center'>
            <button onClick={() => setTab('transcription')}  className={'px-4 py-1 duration-200 ' + (tab === 'transcription' ? (darkMode ? 'bg-purple-700 text-black': 'bg-blue-300 text-white') : (darkMode ? 'bg-purple-200 text-purple-600 hover:text-purple-800' : ' text-blue-400 hover:text-blue-600'))}>Transcrição</button>
            <button onClick={() => setTab('translation')}  className={'px-4 py-1 duration-200 ' + (tab === 'translation' ? (darkMode ? 'bg-purple-700 text-black' : 'bg-blue-300 text-white') : (darkMode ? 'bg-purple-200 text-purple-600 hover:text-purple-800' : 'text-blue-400 hover:text-blue-600'))}>Tradução</button>
        </div>
        <div className='my-8 flex flex-col'>
        {tab === 'transcription' ? (
        <Transcription {...props} textElement={textElement} />
    ) : (
        <Translation {...props} textElement={textElement} translating={translating} toLanguage={toLanguage}
        setTranslation={setTranslation} setTranslating={setTranslating} setToLanguage={setToLanguage}
        generateTranslation={generateTranslation}
        />
    )}
        </div>
    <div className='flex items-center gap-4 mx-auto'>
        <button onClick={handleCopy} title="Copiar" className={'duration-200 px-2 aspect-square grid place-items-center rounded ' + (darkMode ? 'text-purple-500 hover:text-purple-800 bg-gray-900' : 'bg-white text-blue-300 hover:text-blue-500')}>
            <i className={"fa-solid fa-copy p-2 rounded px-4"}></i>
        </button>
        <button onClick={handleDownload} title="Baixar" className={'duration-200 px-2 aspect-square grid place-items-center rounded ' + (darkMode ? 'text-purple-500 hover:text-purple-800 bg-gray-900' : 'bg-white text-blue-300 hover:text-blue-500')}>
            <i className="fa-solid fa-download p-2 rounded px-4"></i>
        </button>
    </div>
    </main>
  )
}
