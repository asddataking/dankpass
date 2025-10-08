'use client';

import { motion } from 'framer-motion';
import { Camera, Upload as UploadIcon, FileImage, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@stackframe/stack';

export default function UploadPage() {
  const user = useUser();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Mock user stats - in production, fetch from database
  const userStats = {
    points: 1250,
    tier: 'Gold'
  };

  // Mock recent receipts
  const recentReceipts = [
    {
      id: 1,
      partner: 'Green Valley Dispensary',
      amount: 45.00,
      points: 90,
      status: 'approved',
      date: '2024-01-10',
      imageUrl: '/placeholder-receipt.jpg'
    },
    {
      id: 2,
      partner: 'Pizza Palace',
      amount: 28.50,
      points: 57,
      status: 'pending',
      date: '2024-01-12',
      imageUrl: '/placeholder-receipt.jpg'
    },
    {
      id: 3,
      partner: 'Cannabis Corner',
      amount: 67.25,
      points: 134,
      status: 'rejected',
      date: '2024-01-08',
      imageUrl: '/placeholder-receipt.jpg'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (const file of uploadedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const { url } = await response.json();
        console.log('File uploaded:', url);
      }
      
      // Clear uploaded files after successful upload
      setUploadedFiles([]);
      alert('Receipts uploaded successfully! They will be reviewed by our team.');
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload receipts. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'rejected':
        return <FileImage className="w-5 h-5 text-red-400" />;
      default:
        return <FileImage className="w-5 h-5 text-white/40" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with Profile Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Welcome, {user?.displayName || user?.primaryEmail?.split('@')[0] || 'User'}!
                </h1>
                <p className="text-white/70">Upload receipts to earn points</p>
              </div>
            </div>

            {/* Points Display */}
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dp-blue-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-dp-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-white">{userStats.points.toLocaleString()}</div>
                  <div className="text-sm text-white/60">Current Points</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-dp-mint">{userStats.tier}</div>
                  <div className="text-xs text-white/60">Tier</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-dp-blue-300 bg-dp-blue-500/10' 
                  : 'border-white/30 bg-white/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: dragActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Camera className="w-12 h-12 text-dp-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Drop your receipt here
                </h3>
                <p className="text-white/70 mb-4">
                  Or click to browse files
                </p>
                <p className="text-sm text-white/50">
                  Supports JPG, PNG, and PDF files
                </p>
              </motion.div>
            </div>

            {/* Upload Tips */}
            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <h4 className="font-medium text-white mb-2">Tips for best results:</h4>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• Make sure the receipt is clearly visible</li>
                <li>• Include the total amount and business name</li>
                <li>• Avoid blurry or dark photos</li>
                <li>• Receipts must be from partner businesses</li>
              </ul>
            </div>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Ready to Upload</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    className="card flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-dp-blue-500/20 rounded-xl flex items-center justify-center">
                      <FileImage className="w-5 h-5 text-dp-blue-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-sm text-white/70">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button className="text-white/60 hover:text-white">
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadIcon className="w-5 h-5" />
                {isUploading ? 'Uploading...' : `Upload ${uploadedFiles.length} Receipt${uploadedFiles.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {/* Recent Receipts */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Uploads</h3>
            <div className="space-y-3">
              {recentReceipts.map((receipt) => (
                <motion.div
                  key={receipt.id}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <FileImage className="w-6 h-6 text-white/70" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{receipt.partner}</h4>
                      <p className="text-sm text-white/70">
                        ${receipt.amount} • {receipt.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(receipt.status)}
                      <div className="text-right">
                        <div className="text-sm font-medium text-dp-mint">
                          {receipt.status === 'approved' ? `+${receipt.points} pts` : ''}
                        </div>
                        <div className={`text-xs capitalize ${
                          receipt.status === 'approved' ? 'text-green-400' : 
                          receipt.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {receipt.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
