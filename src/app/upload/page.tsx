'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@stackframe/stack'
import { Upload, Camera, FileImage, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export default function UploadPage() {
  const user = useUser()
  const router = useRouter()
  
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setUploadStatus('idle')
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      setUploadStatus('success')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/me')
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading
  })


  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl mx-auto mb-4 animate-pulse"></div>
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg"></div>
            <span className="text-xl font-bold">DankPass</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Home
            </Link>
            <Link href="/me" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              My Pass
            </Link>
            <Link href="/rewards" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Rewards
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">
            Upload Receipt
          </h1>
          
          <p className="text-center text-gray-400 mb-12">
            Take a photo of your receipt from any dispensary or restaurant to earn Dank Points
          </p>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
              ${isDragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-green-500'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} disabled={uploading} />
            
            {uploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-lg">Processing your receipt...</p>
                <p className="text-sm text-gray-400">Our AI is reading your receipt and awarding points</p>
              </div>
            ) : uploadStatus === 'success' ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg text-green-500">Receipt uploaded successfully!</p>
                <p className="text-sm text-gray-400">Redirecting to your dashboard...</p>
              </div>
            ) : uploadStatus === 'error' ? (
              <div className="space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <p className="text-lg text-red-500">Upload failed</p>
                <p className="text-sm text-gray-400">{errorMessage}</p>
                <button
                  onClick={() => setUploadStatus('idle')}
                  className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {isDragActive ? 'Drop your receipt here' : 'Drag & drop your receipt here'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    or click to browse files
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Camera className="w-4 h-4" />
                    <span>JPEG, PNG</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileImage className="w-4 h-4" />
                    <span>Max 10MB</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-12 p-6 rounded-2xl bg-gray-900 border border-gray-800">
            <h3 className="text-lg font-bold mb-4">Tips for best results:</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Make sure the receipt is well-lit and readable</li>
              <li>• Include the vendor name, total amount, and date</li>
              <li>• Avoid blurry or dark photos</li>
              <li>• Receipts from dispensaries earn 10 points, restaurants earn 8 points</li>
              <li>• Get both types within 48 hours for a 15-point combo bonus!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
