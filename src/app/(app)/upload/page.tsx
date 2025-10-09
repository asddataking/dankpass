'use client';

import { motion } from 'framer-motion';
import { Camera, Upload as UploadIcon, FileImage, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { ReceiptParseModal } from '@/components/ReceiptParseModal';
import { UploadLimitNudge } from '@/components/UploadLimitNudge';
import { compressImage } from '@/lib/imageCompression';

interface Receipt {
  id: string;
  partner: string | null;
  amount: number | null;
  points: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  imageUrl: string;
}

export default function UploadPage() {
  const user = useUser();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(true);
  const [userStats, setUserStats] = useState({
    points: 0,
    tier: 'Free',
    isPremium: false,
    receiptsThisMonth: 0
  });
  const [showParseModal, setShowParseModal] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);

  const RECEIPTS_LIMIT_FREE = 15;

  // Load user receipts and stats
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      
      try {
        // Fetch user receipts
        const receiptsResponse = await fetch('/api/receipts/user');
        let receiptsThisMonth = 0;
        
        if (receiptsResponse.ok) {
          const data = await receiptsResponse.json();
          const formattedReceipts = data.receipts.map((r: any) => ({
            id: r.id,
            partner: r.partner?.businessName || 'Unknown Business',
            amount: r.total,
            points: r.pointsAwarded || 0,
            status: r.status,
            date: new Date(r.createdAt).toLocaleDateString(),
            imageUrl: r.imageUrl,
            createdAt: r.createdAt
          }));
          setRecentReceipts(formattedReceipts);
          
          // Count receipts this month
          const now = new Date();
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          receiptsThisMonth = data.receipts.filter((r: any) => {
            const receiptDate = new Date(r.createdAt);
            return receiptDate >= firstDayOfMonth;
          }).length;
        }

        // Fetch user stats
        const statsResponse = await fetch('/api/auth/me');
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          
          // In a real implementation, you'd fetch points from a separate endpoint
          setUserStats({
            points: 0, // TODO: Fetch from points API
            tier: data.isPremium ? 'Premium' : 'Free',
            isPremium: data.isPremium || false,
            receiptsThisMonth
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingReceipts(false);
      }
    }

    loadUserData();
  }, [user]);

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

  const loadReceipts = async () => {
    try {
      const receiptsResponse = await fetch('/api/receipts/user');
      if (receiptsResponse.ok) {
        const data = await receiptsResponse.json();
        const formattedReceipts = data.receipts.map((r: any) => ({
          id: r.id,
          partner: r.partner?.businessName || 'Unknown Business',
          amount: r.total,
          points: r.pointsAwarded || 0,
          status: r.status,
          date: new Date(r.createdAt).toLocaleDateString(),
          imageUrl: r.imageUrl
        }));
        setRecentReceipts(formattedReceipts);
      }
    } catch (error) {
      console.error('Error loading receipts:', error);
    }
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    // Check upload limit for free tier
    if (!userStats.isPremium && userStats.receiptsThisMonth >= RECEIPTS_LIMIT_FREE) {
      alert(`You've reached your monthly limit of ${RECEIPTS_LIMIT_FREE} receipts. Upgrade to Premium for unlimited uploads!`);
      return;
    }
    
    setIsUploading(true);
    
    try {
      for (const file of uploadedFiles) {
        // Compress image before upload
        let fileToUpload = file;
        if (file.type.startsWith('image/')) {
          try {
            fileToUpload = await compressImage(file, {
              maxWidth: 1920,
              maxHeight: 1920,
              quality: 0.85,
              maxSizeMB: 1
            });
            console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
          } catch (compressionError) {
            console.warn('Image compression failed, using original:', compressionError);
          }
        }
        
        const formData = new FormData();
        formData.append('file', fileToUpload);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }
        
        const { url } = await response.json();
        console.log('File uploaded:', url);
        
        // Parse receipt with OpenAI (if OPENAI_API_KEY is configured)
        try {
          const parseResponse = await fetch('/api/parse-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blobUrl: url, userId: user?.id })
          });
          
          if (parseResponse.ok) {
            const parseData = await parseResponse.json();
            setParseResult({
              merchant: parseData.parsed?.merchant,
              purchase_date: parseData.parsed?.purchase_date,
              total: parseData.parsed?.total || 0,
              pointsAwarded: parseData.pointsAwarded || 0
            });
            setShowParseModal(true);
          }
        } catch (parseError) {
          console.log('Receipt parsing skipped or failed:', parseError);
          // Continue even if parsing fails
        }
      }
      
      // Clear uploaded files after successful upload
      setUploadedFiles([]);
      
      // Reload receipts to show new uploads
      await loadReceipts();
      
      // Show upgrade prompt after first upload (only once per session)
      if (recentReceipts.length === 0 && !hasShownPrompt && !userStats.isPremium) {
        setTimeout(() => {
          setShowUpgradePrompt(true);
          setHasShownPrompt(true);
        }, 1500);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload receipts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-brand-success" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-brand-warn" />;
      case 'rejected':
        return <FileImage className="w-5 h-5 text-brand-error" />;
      default:
        return <FileImage className="w-5 h-5 text-brand-subtle" />;
    }
  };

  return (
    <div className="min-h-screen">
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
                <h1 className="text-2xl font-bold text-brand-ink mb-1">
                  Welcome, {user?.displayName || user?.primaryEmail?.split('@')[0] || 'User'}!
                </h1>
                <p className="muted">Upload receipts to earn points</p>
              </div>
            </div>

            {/* Points Display */}
            <div className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-brand-ink">{userStats.points.toLocaleString()}</div>
                  <div className="muted">Current Points</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-brand-success">{userStats.tier}</div>
                  <div className="muted">Tier</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Limit Nudge */}
          <UploadLimitNudge 
            receiptsUsed={userStats.receiptsThisMonth}
            receiptsLimit={RECEIPTS_LIMIT_FREE}
            isPremium={userStats.isPremium}
          />

          {/* Upload Area */}
          <div className="mb-8">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-brand-primary bg-brand-primary/10' 
                  : 'border-brand-ink/20 bg-brand-bg'
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
                <Camera className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-brand-ink mb-2">
                  Drop your receipt here
                </h3>
                <p className="muted mb-4">
                  Or click to browse files
                </p>
                <p className="text-sm text-brand-subtle">
                  Supports JPG, PNG, and PDF files
                </p>
              </motion.div>
            </div>

            {/* Upload Tips */}
            <div className="mt-4 p-4 bg-brand-bg rounded-xl">
              <h4 className="font-medium text-brand-ink mb-2">Tips for best results:</h4>
              <ul className="muted space-y-1">
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
              <h3 className="text-lg font-semibold text-brand-ink mb-4">Ready to Upload</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    className="card flex items-center gap-3 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                      <FileImage className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-brand-ink">{file.name}</p>
                      <p className="muted">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button className="text-brand-subtle hover:text-brand-ink">
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
            <h3 className="text-lg font-semibold text-brand-ink mb-4">Recent Uploads</h3>
            {isLoadingReceipts ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="muted">Loading receipts...</p>
              </div>
            ) : recentReceipts.length === 0 ? (
              <div className="card text-center py-8">
                <FileImage className="w-12 h-12 text-brand-subtle mx-auto mb-3" />
                <p className="muted">No receipts uploaded yet</p>
                <p className="text-sm text-brand-subtle mt-1">Upload your first receipt to start earning points!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReceipts.map((receipt) => (
                <motion.div
                  key={receipt.id}
                  className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center">
                      <FileImage className="w-6 h-6 text-brand-subtle" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-brand-ink">{receipt.partner}</h4>
                      <p className="muted">
                        {receipt.amount ? `$${receipt.amount.toFixed(2)} • ` : ''}{receipt.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(receipt.status)}
                      <div className="text-right">
                        <div className="text-sm font-medium text-brand-success">
                          {receipt.status === 'approved' ? `+${receipt.points} pts` : ''}
                        </div>
                        <div className={`text-xs capitalize ${
                          receipt.status === 'approved' ? 'text-brand-success' : 
                          receipt.status === 'pending' ? 'text-brand-warn' : 'text-brand-error'
                        }`}>
                          {receipt.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Receipt Parse Success Modal */}
      <ReceiptParseModal
        show={showParseModal}
        onClose={() => setShowParseModal(false)}
        data={parseResult}
      />

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt 
        show={showUpgradePrompt} 
        onClose={() => setShowUpgradePrompt(false)}
        pointsEarned={10}
      />
    </div>
  );
}
