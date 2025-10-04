'use client'

import { useState } from 'react'
import { Clock, Eye, Users, Gift } from 'lucide-react'

interface AdminDashboardProps {
  pendingReceipts: Array<{
    id: string
    user_id: string
    vendor: string
    kind: 'dispensary' | 'restaurant' | 'unknown'
    status: 'pending' | 'approved' | 'denied'
    created_at: string
    deny_reason?: string
  }>
  recentReceipts: Array<{
    id: string
    user_id: string
    vendor: string
    kind: 'dispensary' | 'restaurant' | 'unknown'
    status: 'pending' | 'approved' | 'denied'
    created_at: string
  }>
  recentRedemptions: Array<{
    id: string
    user_id: string
    reward_code: string
    points_cost: number
    status: 'pending' | 'fulfilled' | 'cancelled'
    created_at: string
  }>
  partners: Array<{
    id: string
    name: string
    kind: 'dispensary' | 'restaurant'
    is_featured: boolean
    city: string
    state: string
  }>
  agentEvents: Array<{
    id: string
    receipt_id: string
    event_type: string
    details: Record<string, unknown>
    created_at: string
  }>
}

export default function AdminDashboard({
  pendingReceipts,
  recentReceipts,
  recentRedemptions,
  partners,
  agentEvents
}: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'receipts' | 'redemptions' | 'partners' | 'events'>('receipts')
  const [processing, setProcessing] = useState<string | null>(null)

  const handleApproveReceipt = async (receiptId: string) => {
    setProcessing(receiptId)
    try {
      const response = await fetch('/api/admin/receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiptId,
          action: 'approve'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to approve receipt')
      }

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error approving receipt:', error)
      alert('Failed to approve receipt')
    } finally {
      setProcessing(null)
    }
  }

  const handleDenyReceipt = async (receiptId: string, reason: string) => {
    setProcessing(receiptId)
    try {
      const response = await fetch('/api/admin/receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiptId,
          action: 'deny',
          reason
        })
      })

      if (!response.ok) {
        throw new Error('Failed to deny receipt')
      }

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error denying receipt:', error)
      alert('Failed to deny receipt')
    } finally {
      setProcessing(null)
    }
  }

  const handleFulfillRedemption = async (redemptionId: string) => {
    setProcessing(redemptionId)
    try {
      const response = await fetch('/api/admin/redemptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redemptionId,
          action: 'fulfill'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fulfill redemption')
      }

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error fulfilling redemption:', error)
      alert('Failed to fulfill redemption')
    } finally {
      setProcessing(null)
    }
  }

  const stats = {
    pendingReceipts: pendingReceipts.length,
    totalReceipts: recentReceipts.length,
    approvedReceipts: recentReceipts.filter(r => r.status === 'approved').length,
    deniedReceipts: recentReceipts.filter(r => r.status === 'denied').length,
    pendingRedemptions: recentRedemptions.filter(r => r.status === 'pending').length,
    totalPartners: partners.length,
    featuredPartners: partners.filter(p => p.is_featured).length
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending Receipts</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.pendingReceipts}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Receipts</p>
              <p className="text-2xl font-bold text-blue-500">{stats.totalReceipts}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending Redemptions</p>
              <p className="text-2xl font-bold text-purple-500">{stats.pendingRedemptions}</p>
            </div>
            <Gift className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Partners</p>
              <p className="text-2xl font-bold text-green-500">{stats.totalPartners}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {[
          { id: 'receipts', label: 'Receipts', count: pendingReceipts.length },
          { id: 'redemptions', label: 'Redemptions', count: stats.pendingRedemptions },
          { id: 'partners', label: 'Partners', count: partners.length },
          { id: 'events', label: 'Agent Events', count: agentEvents.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as 'receipts' | 'redemptions' | 'partners' | 'events')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedTab === tab.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'receipts' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Pending Receipts</h2>
          {pendingReceipts.length === 0 ? (
            <p className="text-gray-400">No pending receipts</p>
          ) : (
            <div className="space-y-4">
              {pendingReceipts.map((receipt) => (
                <div key={receipt.id} className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{receipt.vendor || 'Unknown Vendor'}</h3>
                      <p className="text-sm text-gray-400">
                        {receipt.kind} • {new Date(receipt.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveReceipt(receipt.id)}
                        disabled={processing === receipt.id}
                        className="px-4 py-2 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600 disabled:opacity-50"
                      >
                        {processing === receipt.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for denial:')
                          if (reason) handleDenyReceipt(receipt.id, reason)
                        }}
                        disabled={processing === receipt.id}
                        className="px-4 py-2 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600 disabled:opacity-50"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                  {receipt.deny_reason && (
                    <p className="text-sm text-red-400">Denied: {receipt.deny_reason}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'redemptions' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Recent Redemptions</h2>
          {recentRedemptions.length === 0 ? (
            <p className="text-gray-400">No redemptions</p>
          ) : (
            <div className="space-y-4">
              {recentRedemptions.map((redemption) => (
                <div key={redemption.id} className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{redemption.reward_code}</h3>
                      <p className="text-sm text-gray-400">
                        {redemption.points_cost} points • {new Date(redemption.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        redemption.status === 'fulfilled' ? 'bg-green-500/20 text-green-500' :
                        redemption.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {redemption.status}
                      </span>
                      {redemption.status === 'pending' && (
                        <button
                          onClick={() => handleFulfillRedemption(redemption.id)}
                          disabled={processing === redemption.id}
                          className="px-4 py-2 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600 disabled:opacity-50"
                        >
                          {processing === redemption.id ? 'Processing...' : 'Fulfill'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'partners' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Partners</h2>
          {partners.length === 0 ? (
            <p className="text-gray-400">No partners</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {partners.map((partner) => (
                <div key={partner.id} className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{partner.name}</h3>
                    {partner.is_featured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 capitalize">
                    {partner.kind} • {partner.city}, {partner.state}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'events' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Agent Events</h2>
          {agentEvents.length === 0 ? (
            <p className="text-gray-400">No agent events</p>
          ) : (
            <div className="space-y-4">
              {agentEvents.map((event) => (
                <div key={event.id} className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{event.event_type}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Receipt ID: {event.receipt_id}
                  </p>
                  {event.details && (
                    <pre className="text-xs text-gray-500 mt-2 bg-gray-800 p-2 rounded">
                      {JSON.stringify(event.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
