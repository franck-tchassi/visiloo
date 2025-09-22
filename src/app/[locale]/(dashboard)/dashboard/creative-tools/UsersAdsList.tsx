"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react'



const UsersAdsList = () => {
    const [adsList, setAdsList] = useState([]);
    return (
        <div>
            <h2 className="font-extrabold text-3xl mb-6 text-center text-gray-800 tracking-tight">
               My Ads
            </h2>
            {adsList?.length === 0 &&
                <div className='flex flex-col items-center justify-center gap-4 mt-20'>
                    {/* Icône image SVG à la place de l'image */}
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-xl">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-gray-300"
                            fill="none"
                            viewBox="0 0 64 64"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <rect x="8" y="8" width="48" height="48" rx="8" fill="none" />
                            <circle cx="24" cy="24" r="4" />
                            <path d="M16 48l12-16 8 10 8-8 8 14" />
                        </svg>
                    </div>
                    <h2 className='text-lg font-semibold'>You don't have ads created</h2>
                    <Button>Create New Ads</Button>
                </div>}
        </div>
    )
}

export default UsersAdsList