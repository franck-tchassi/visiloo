import React from 'react'



const FormWrap = ({children} : {children: React.ReactNode}) => {
  return (
    <div className='
     min-h-fit h-full flex items-center justify-center pb-12 pt-24
    '>
        <div className='
            w-full
            max-w-[650px]
            p-4
            gap-6
            rounded-lg
            border
            shadow-slate-300
            md:p-8
            bg-white
        '>
            {children}
        </div>
    </div>
    
  )
}

export default FormWrap