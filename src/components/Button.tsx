'use client'

import React from 'react'
import { IconType } from 'react-icons'

interface ButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  outline?: boolean
  icon?: IconType
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  icon: Icon,
  type = 'button'
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`
        w-full 
        flex 
        items-center 
        justify-center 
        gap-2 
        px-4 
        py-2 
        text-sm 
        font-medium 
        rounded-md 
        transition 
        cursor-pointer
        border 
        ${outline
          ? 'bg-white text-black border-gray-300 hover:bg-gray-100'
          : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'}
        disabled:opacity-50 
        disabled:cursor-not-allowed
      `}
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  )
}

export default Button
