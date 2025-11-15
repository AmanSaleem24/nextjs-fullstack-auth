"use client"
import axios from "axios"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const [token, setToken] = useState("")
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isVerifying, setIsVerifying] = useState(false)

    const verifyEmail = async () => {
        try {
            setIsVerifying(true)
            setError(false)
            const response = await axios.post('/api/users/verifyemail', { token })
            setIsVerified(true)
            console.log("Verification successful:", response.data)
        } catch (error: any) {
            setError(true)
            setErrorMessage(
                error.response?.data?.error || 
                "Failed to verify email. The link may be invalid or expired."
            )
            console.error("Verification error:", error.response?.data)
        } finally {
            setIsVerifying(false)
        }
    }

    useEffect(() => {
        // Use Next.js useSearchParams for better URL handling
        const urlToken = searchParams.get("token")
        if (urlToken) {
            setToken(urlToken)
        } else {
            setError(true)
            setErrorMessage("No verification token found in URL")
        }
    }, [searchParams])

    useEffect(() => {
        if (token.length > 0) {
            verifyEmail()
        }
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
                    Verify Email
                </h1>

                {/* Loading State */}
                {isVerifying && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-600">Verifying your email...</p>
                    </div>
                )}

                {/* Success State */}
                {isVerified && !isVerifying && (
                    <div className="text-center py-6">
                        <div className="mb-4">
                            <svg 
                                className="w-16 h-16 text-green-500 mx-auto" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-green-600 mb-4">
                            Email Verified Successfully!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your email has been verified. You can now log in to your account.
                        </p>
                        <Link 
                            href="/login"
                            className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}

                {/* Error State */}
                {error && !isVerifying && (
                    <div className="text-center py-6">
                        <div className="mb-4">
                            <svg 
                                className="w-16 h-16 text-red-500 mx-auto" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-red-600 mb-4">
                            Verification Failed
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {errorMessage}
                        </p>
                        <div className="space-y-3">
                            <Link 
                                href="/signup"
                                className="block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Sign Up Again
                            </Link>
                            <Link 
                                href="/login"
                                className="block px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}

                {/* Debug Info (Remove in production) */}
                {process.env.NODE_ENV === 'development' && token && (
                    <div className="mt-6 p-4 bg-gray-100 rounded text-xs">
                        <p className="font-semibold mb-2">Debug Info:</p>
                        <p className="break-all text-gray-600">Token: {token.substring(0, 20)}...</p>
                    </div>
                )}
            </div>
        </div>
    )
}