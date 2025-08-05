"use client"
import React from 'react';
import { redirect } from 'next/navigation';

export default function NotFound() {
    //  Will Replace Soon

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#232323]">
            <div className="max-w-lg w-full text-center">
                <div className="relative mb-8">
                    <h1
                        className="text-9xl font-bold text-transparent bg-clip-text"
                        style={{
                            backgroundImage: 'linear-gradient(135deg, rgb(0, 219, 195) 0%, rgb(33, 150, 243) 100%)',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        404
                    </h1>
                    <div className="absolute inset-0 text-9xl font-bold text-gray-800 -z-10">404</div>
                </div>
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
                    <p className="text-gray-500 text-sm">Error Code: 404 - Page Not Found</p>
                </div>
                <div className="space-y-4">
                    <button 
                    name='Go Back'
                    title='Go Back'
                    onClick={()=> redirect('/Main')}
                    className="cursor-pointer w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-600 flex items-center justify-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left w-5 h-5">
                            <path d="m12 19-7-7 7-7">
                            </path>
                            <path d="M19 12H5">
                            </path>
                        </svg>
                        <span>Go Back</span>
                    </button>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-gray-500 text-sm">If you believe this is an error, please contact your system administrator.</p>
                </div>
            </div>
        </div>
    );
}
