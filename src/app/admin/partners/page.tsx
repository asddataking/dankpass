'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Building2, MapPin, Phone, Mail, Globe, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Partner {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: {
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    async function fetchPartners() {
      try {
        const response = await fetch('/api/partners');
        if (response.ok) {
          const data = await response.json();
          setPartners(data.partners || []);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  const handleStatusUpdate = async (partnerId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setPartners(prev => prev.map(partner => 
          partner.id === partnerId ? { ...partner, status } : partner
        ));
      } else {
        throw new Error('Failed to update partner status');
      }
    } catch (error) {
      console.error('Error updating partner status:', error);
      alert('Failed to update partner status. Please try again.');
    }
  };

  const filteredPartners = partners.filter(partner => 
    selectedStatus === 'all' || partner.status === selectedStatus
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
          <p className="text-white/70">Loading partners...</p>
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
                <h1 className="text-3xl font-bold text-white mb-2">Partner Management</h1>
                <p className="text-white/70">Review and manage partner applications</p>
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
                    {status} ({partners.filter(p => status === 'all' || p.status === status).length})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Partners List */}
          <div className="space-y-4">
            {filteredPartners.length === 0 ? (
              <div className="card text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No partners found</h3>
                <p className="text-gray-600">
                  {selectedStatus === 'all' 
                    ? 'No partner applications have been submitted yet.'
                    : `No partners with status "${selectedStatus}" found.`
                  }
                </p>
              </div>
            ) : (
              filteredPartners.map((partner) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-dp-mint/20 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-dp-mint" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{partner.businessName}</h3>
                          <p className="text-gray-600 capitalize">{partner.businessType}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(partner.status)}`}>
                          {getStatusIcon(partner.status)}
                          {partner.status}
                        </div>
                      </div>

                      {partner.description && (
                        <p className="text-gray-700 mb-4">{partner.description}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          {partner.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">{partner.phone}</span>
                            </div>
                          )}
                          {partner.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm">{partner.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {partner.website && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Globe className="w-4 h-4" />
                              <a 
                                href={partner.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-dp-blue-500 hover:text-dp-blue-600"
                              >
                                {partner.website}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">
                              {partner.user.profile?.firstName} {partner.user.profile?.lastName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Applied on {new Date(partner.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      {partner.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(partner.id, 'approved')}
                            className="btn-primary flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(partner.id, 'rejected')}
                            className="btn-secondary flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      
                      <Link
                        href={`/admin/partners/${partner.id}`}
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
