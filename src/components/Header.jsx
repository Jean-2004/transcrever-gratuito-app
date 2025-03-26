import React from 'react'

export default function Header(props) {
  const { darkMode } = props

  return (
    <header className='flex items-center justify-between gap-4 p-4'>
              <a href="/"><h1 className='font-medium'>Transcrição <span
              className={'bold ' + (darkMode ? 'text-purple-500' : 'text-blue-400')}>Grátis</span></h1></a>
              <a href="/" className={'text-sm flex items-center gap-2 specialBtn px-3 py-2 rounded-lg ' + (darkMode ? 'text-purple-500 specialBtnDark' : ' text-blue-400')}>
                <p>Novo</p>
                <i className="fa-solid fa-plus"></i>
              </a>
    </header>
  )
}
