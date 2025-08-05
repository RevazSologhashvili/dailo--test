"use client"
import { MessageCircle } from 'lucide-react'
import React from 'react'

export default function NotSelected() {
    return (
        <div className='flex flex-col items-center justify-center w-full text-center'>
            <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-2xl'>
                <MessageCircle className='text-gray-300 size-9'/>
            </div>
            <p className='mb-2 text-lg font-semibold text-white'>Select a conversation</p>
            <p className='max-w-md text-gray-400'>Choose a conversation from the sidebar to start chatting with your customers.</p>
        </div>
    )
}
