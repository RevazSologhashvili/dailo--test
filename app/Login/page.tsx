"use client"
import React, { useState, useEffect } from 'react';
import { LoginHandler } from "../apis/LoginHandler"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export default function Page() {
    const { setUser } = useUser();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    // Load remembered username on component mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);
    
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear previous errors
        
        try {
            const user = await LoginHandler(username.toLowerCase(), password);
            if (user) {
                // Handle remember me functionality
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }
                
                setUser(user);
                router.push('/Main');
            }
        } catch (err) {
            // Handle the error thrown by LoginHandler
            setError('Invalid username or password. Please try again.');
            console.error(err)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#212121' }}>
            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center w-full px-8 py-12 bg-gray-900">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-4 text-2xl font-bold text-white">Dailo.ai</h1>
                        <p className="text-gray-400">Sign in to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="text-red-300 font-medium">Authentication Failed</p>
                                    <p className="text-red-400 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Form - Key attributes for browser password manager */}
                    <form 
                        className="space-y-6" 
                        onSubmit={handleLogin}
                        autoComplete="on"
                    >
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setUsername(e.target.value);
                                        if (error) setError(''); // Clear error when user starts typing
                                    }}
                                    required
                                    className={`w-full py-3 pl-12 pr-4 text-white placeholder-gray-400 transition-all bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        error ? 'border-red-500/50' : 'border-gray-700'
                                    }`}
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setPassword(e.target.value);
                                        if (error) setError(''); // Clear error when user starts typing
                                    }}
                                    required
                                    className={`w-full py-3 pl-12 pr-12 text-white placeholder-gray-400 transition-all bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        error ? 'border-red-500/50' : 'border-gray-700'
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    title='show password'
                                    name='show password'
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-teal-500 bg-gray-800 border-gray-700 rounded focus:ring-teal-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            title='Login Button'
                            name='Login Button'
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-all cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: isLoading ? '#6b7280' : 'linear-gradient(to right, #00dbc3, #2196f3)' }}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span>Sign in</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};