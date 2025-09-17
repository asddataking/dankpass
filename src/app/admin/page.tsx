'use client';

import { useState } from 'react';
import { Plus, QrCode, Download, Settings, Users } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-retro font-bold bg-neon-gradient bg-clip-text text-transparent">
                DankPass Admin
              </h1>
              <p className="text-gray-400">Manage stamps and QR codes for your business</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-neon-gradient rounded-xl text-white font-bold hover:scale-105 transition-all duration-300">
                <Download className="w-5 h-5 inline-block mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-dark-border bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'create', label: 'Create Stamps', icon: Plus },
              { id: 'qr', label: 'QR Codes', icon: QrCode },
              { id: 'analytics', label: 'Analytics', icon: Settings },
              { id: 'users', label: 'Users', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-neon-cyan text-neon-cyan'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'create' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Strain Stamp */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-neon-pink rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                Create Strain Stamp
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Strain Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-neon-pink focus:outline-none transition-all"
                    placeholder="e.g., Blue Dream"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lineage
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-neon-pink focus:outline-none transition-all"
                    placeholder="e.g., Blueberry x Haze"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Terpenes
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-neon-pink focus:outline-none transition-all"
                    placeholder="e.g., Myrcene, Pinene, Caryophyllene"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-neon-pink focus:outline-none transition-all resize-none"
                    placeholder="Additional strain information..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-neon-gradient rounded-xl text-white font-bold hover:scale-105 transition-all duration-300"
                >
                  Create Strain Stamp
                </button>
              </form>
            </div>

            {/* Create Activity Stamp */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                Create Activity Stamp
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none transition-all"
                    placeholder="e.g., Cannabis Cup 2024"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none transition-all"
                    placeholder="e.g., Denver, CO"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Details
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none transition-all resize-none"
                    placeholder="Event description and details..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-neon-gradient rounded-xl text-white font-bold hover:scale-105 transition-all duration-300"
                >
                  Create Activity Stamp
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">QR Code Generator</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Generate QR Code</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stamp Type
                    </label>
                    <select className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-neon-cyan focus:outline-none">
                      <option>Strain</option>
                      <option>Activity</option>
                      <option>Lodging</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stamp ID
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none"
                      placeholder="Select a stamp to generate QR code"
                    />
                  </div>
                  
                  <button className="w-full py-3 bg-neon-gradient rounded-xl text-white font-bold hover:scale-105 transition-all duration-300">
                    Generate QR Code
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-48 h-48 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-gray-400">QR Code will appear here</p>
                <button className="mt-4 px-6 py-2 border border-neon-cyan rounded-xl text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300">
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 text-center">
              <h3 className="text-2xl font-bold text-neon-pink mb-2">1,247</h3>
              <p className="text-gray-400">Total Scans</p>
            </div>
            
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 text-center">
              <h3 className="text-2xl font-bold text-neon-cyan mb-2">89</h3>
              <p className="text-gray-400">Active Users</p>
            </div>
            
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 text-center">
              <h3 className="text-2xl font-bold text-neon-purple mb-2">156</h3>
              <p className="text-gray-400">Stamps Created</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Scans</th>
                    <th className="text-left py-3 px-4">Last Active</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-border">
                    <td className="py-3 px-4">John Doe</td>
                    <td className="py-3 px-4">john@example.com</td>
                    <td className="py-3 px-4">23</td>
                    <td className="py-3 px-4">2 hours ago</td>
                    <td className="py-3 px-4">
                      <button className="text-neon-cyan hover:text-neon-pink transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
