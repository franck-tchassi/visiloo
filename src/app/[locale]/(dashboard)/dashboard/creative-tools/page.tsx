import { Button } from '@/components/ui/button';
import Image from 'next/image';
import path from 'path';
import React from 'react'
import UsersAdsList from './UsersAdsList';

const AiTools = [
    {
        name: 'AI Products Images',
        desc: 'Generate high-quality professional product images with AI.',
        bannerImage: '/product-image.png',
        path: '/dashboard/creative-tools/ai-product-image'
    },
    {
        name: 'AI Products Video',
        desc: 'Create engaging product showcase videos with AI.',
        bannerImage: '/product-video.png',
        path: '/dashboard/creative-tools/ai-product-video'
    },
    {
        name: 'AI Products With Avatar',
        desc: 'Bring your products to life with AI-generated avatars.',
        bannerImage: '/product-avatar.png',
        path: '/dashboard/creative-tools/ai-product-avatar'
    }
]

const AiToolList = () => {
    return (
        <div className="max-w-6xl mx-auto py-8">
            <h2 className="font-extrabold text-3xl mb-6 text-center text-gray-800 tracking-tight">
                Creative AI Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {AiTools.map((tool, index) => (
                    <div
                        key={index}
                        className="group bg-white border border-gray-200 rounded-3xl  transition-all duration-300 p-4 flex flex-col items-center justify-between relative overflow-hidden"
                    >
                        <div className="w-full flex-1 flex flex-col items-center text-center">
                            <h3 className="font-bold text-lg mb-2 text-indigo-700 group-hover:text-indigo-900 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-gray-500 mb-2">{tool.desc}</p>
                            <Button 
                                className='mt-4 cursor-pointer'
                                >
                                Create Now
                            </Button>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="relative w-56 h-56">
                                <Image
                                    src={tool.bannerImage}
                                    alt={tool.name}
                                    fill
                                    className="object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, 350px"
                                />
                            </div>
                        </div>
                        <div className="absolute inset-0 pointer-events-none rounded-3xl group-hover:ring-4 group-hover:ring-indigo-100 transition-all duration-300" />
                    </div>
                ))}
            </div>
            <UsersAdsList />
        </div>
    )
}

export default AiToolList;