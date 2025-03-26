import React from 'react'

export default function FileDisplay(props) {
    const { darkMode, handleAudioReset, file, audioStream, handleFormSubmission } = props
  return (
    <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 w-72 sm:w-96 max-w-full mx-auto'>
        <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl'>Seu <span className={'bold ' + (darkMode ? 'text-purple-500' : 'text-blue-400')}>Arquivo</span></h1>
        <div className='flex flex-col text-left my-4'>
            <h3 className='font-semibold'>Name</h3>
            <p>{file ? file.name : 'Áudio customizado'}</p>
        </div>
        <div className='flex items-center justify-between gap-4'>
            <button onClick={handleAudioReset} className={'text-slate-400 duration-200 ' + (darkMode ? ' hover:text-purple-800' : 'hover:text-blue-600')}>Resetar</button>
            <button onClick={handleFormSubmission} className={'specialBtn px-3 p-2 rounded-lg flex items-center gap-2 font-medium ' + (darkMode ? 'text-purple-500 specialBtnDark'  : 'text-blue-400')}>
                <p>Transcrever</p>
                <i className="fa-solid fa-pen-nib"></i>
            </button>
        </div>
    </main>
  )
}
