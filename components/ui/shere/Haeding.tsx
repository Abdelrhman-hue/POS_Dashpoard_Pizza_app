import React from 'react'

function Heading({title, subtitle}:{title: string, subtitle: string}) {
  return (
    <div className='flex flex-col items-center justify-center gap-2 mb-10 animate-fade-up'>
      <h1 className='text-primary font-bold text-4xl italic'>{title}</h1>
      <h2 className='uppercase text-muted-foreground font-semibold leading-4'>{subtitle}</h2>
    </div>
  )
}

export default Heading
