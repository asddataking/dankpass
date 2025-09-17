'use client';

import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QrCode, Plus, Star, MapPin, Home, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function PassportDashboard() {
  const user = useUser({ or: 'redirect' });
  const router = useRouter();
  const [passports, setPassports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // TODO: Fetch user passports from API
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-pulse text-neon-cyan text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-retro font-bold bg-neon-gradient bg-clip-text text-transparent">
                DankPass
              </h1>
              <p className="text-gray-400">Welcome back, {user?.displayName || user?.primaryEmail}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-3 border border-neon-cyan rounded-xl text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300">
                <QrCode className="w-5 h-5" />
              </button>
              <button 
                onClick={() => user?.signOut()}
                className="p-3 border border-red-500 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button className="p-6 bg-dark-surface border border-dark-border rounded-2xl hover:border-neon-pink transition-all duration-300 group">
            <QrCode className="w-8 h-8 text-neon-pink mb-4 group-hover:animate-pulse" />
            <h3 className="text-lg font-bold mb-2">Scan QR Code</h3>
            <p className="text-gray-400 text-sm">Add new stamps to your passport</p>
          </button>

          <button className="p-6 bg-dark-surface border border-dark-border rounded-2xl hover:border-neon-cyan transition-all duration-300 group">
            <Plus className="w-8 h-8 text-neon-cyan mb-4 group-hover:animate-pulse" />
            <h3 className="text-lg font-bold mb-2">Add Entry</h3>
            <p className="text-gray-400 text-sm">Manually log a strain or activity</p>
          </button>

          <button className="p-6 bg-dark-surface border border-dark-border rounded-2xl hover:border-neon-purple transition-all duration-300 group">
            <Star className="w-8 h-8 text-neon-purple mb-4 group-hover:animate-pulse" />
            <h3 className="text-lg font-bold mb-2">View Stats</h3>
            <p className="text-gray-400 text-sm">See your collection analytics</p>
          </button>
        </div>

        {/* Passport Entries */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Your Passport Entries</h2>
          
          {passports.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">No entries yet</h3>
              <p className="text-gray-400 mb-6">Start scanning QR codes or adding entries to build your passport</p>
              <button className="px-6 py-3 bg-neon-gradient rounded-xl text-white font-bold hover:scale-105 transition-all duration-300">
                Get Started
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Placeholder entries */}
              <div className="p-4 border border-dark-border rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Blue Dream</h4>
                    <p className="text-gray-400 text-sm">Strain • Added 2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-dark-surface border border-dark-border rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-dark-border rounded-xl">
              <div className="w-10 h-10 bg-neon-pink/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-neon-pink" />
              </div>
              <div>
                <p className="font-bold">Visited Green Valley Dispensary</p>
                <p className="text-gray-400 text-sm">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-dark-border rounded-xl">
              <div className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-neon-cyan" />
              </div>
              <div>
                <p className="font-bold">Stayed at Cannabis Resort</p>
                <p className="text-gray-400 text-sm">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
