'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Receipt, User, Building2, CheckCircle, XCircle, Clock, Eye, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Receipt {
  id: string;
  userId: string;
  partnerId?: string;
  imageUrl: string;
  subtotal?: string;
  total?: string;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
  createdAt: string;
  adminNotes?: string;
  user: {
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
  partner?: {
    businessName: string;
  };
}

export default function AdminReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    async function fetchReceipts() {
      try {
        const response = await fetch('/api/receipts?status=pending');
        if (response.ok) {
          const data = await response.json();
          setReceipts(data.receipts || []);
        }
      } catch (error) {
        console.error('Error fetching receipts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReceipts();
  }, []);

  const handleStatusUpdate = async (receiptId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    try {
      const response = await fetch(`/api/receipts/${receiptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (response.ok) {
        setReceipts(prev => prev.map(receipt => 
          receipt.id === receiptId ? { ...receipt, status } : receipt
        ));
      } else {
        throw new Error('Failed to update receipt status');
      }
    } catch (error) {
      console.error('Error updating receipt status:', error);
      alert('Failed to update receipt status. Please try again.');
    }
  };

  const filteredReceipts = receipts.filter(receipt => 
    selectedStatus === 'all' || receipt.status === selectedStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-dp-blue-300 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin Dashboard
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Receipt Management</h1>
                <p className="text-white/70">Review and approve receipt uploads</p>
              </div>
              
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                      selectedStatus === status
                        ? 'bg-dp-blue-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {status} ({receipts.filter(r => status === 'all' || r.status === status).length})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Receipts List */}
          <div className="space-y-4">
            {filteredReceipts.length === 0 ? (
              <div className="card text-center py-12">
                <Receipt className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No receipts found</h3>
                <p className="text-white/70">
                  {selectedStatus === 'all' 
                    ? 'No receipts have been uploaded yet.'
                    : `No receipts with status "${selectedStatus}" found.`
                  }
                </p>
              </div>
            ) : (
              filteredReceipts.map((receipt) => (
                <motion.div
                  key={receipt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex items-start gap-4">
                    {/* Receipt Image */}
                    <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      {receipt.imageUrl ? (
                        <Image
                          src={receipt.imageUrl}
                          alt="Receipt"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Receipt className="w-8 h-8 text-white/40" />
                      )}
                    </div>

                    {/* Receipt Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Receipt #{receipt.id.slice(-8)}
                          </h3>
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <User className="w-4 h-4" />
                            <span>
                              {receipt.user.profile?.firstName} {receipt.user.profile?.lastName}
                            </span>
                            {receipt.partner && (
                              <>
                                <span>•</span>
                                <Building2 className="w-4 h-4" />
                                <span>{receipt.partner.businessName}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(receipt.status)}`}>
                          {getStatusIcon(receipt.status)}
                          {receipt.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {receipt.subtotal && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-white/60" />
                            <div>
                              <div className="text-xs text-white/60">Subtotal</div>
                              <div className="text-sm font-medium text-white">${receipt.subtotal}</div>
                            </div>
                          </div>
                        )}
                        {receipt.total && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-white/60" />
                            <div>
                              <div className="text-xs text-white/60">Total</div>
                              <div className="text-sm font-medium text-white">${receipt.total}</div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-dp-blue-500/20 rounded flex items-center justify-center">
                            <span className="text-xs text-dp-blue-300 font-bold">P</span>
                          </div>
                          <div>
                            <div className="text-xs text-white/60">Points</div>
                            <div className="text-sm font-medium text-white">{receipt.pointsAwarded}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-white/60" />
                          <div>
                            <div className="text-xs text-white/60">Uploaded</div>
                            <div className="text-sm text-white/70">
                              {new Date(receipt.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {receipt.adminNotes && (
                        <div className="bg-white/5 rounded-lg p-3 mb-4">
                          <div className="text-xs text-white/60 mb-1">Admin Notes:</div>
                          <div className="text-sm text-white/80">{receipt.adminNotes}</div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      {receipt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(receipt.id, 'approved')}
                            className="btn-primary flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Rejection reason (optional):');
                              handleStatusUpdate(receipt.id, 'rejected', notes || undefined);
                            }}
                            className="btn-secondary flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      
                      <Link
                        href={`/admin/receipts/${receipt.id}`}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
