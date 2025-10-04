import Link from 'next/link'
import { Upload, Star, Gift, Zap, ArrowRight } from 'lucide-react'
import { getFeaturedPartners } from '@/lib/neon-db'

export default async function HomePage() {
  // Fetch featured partners
  const featuredPartners = await getFeaturedPartners()

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
            <Link href="/upload" className="px-4 py-2 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
              Upload
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

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-transparent">
            DankPass
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Upload receipts from dispensaries and restaurants → Earn Dank Points → Redeem rewards
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/upload"
              className="group px-8 py-4 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all duration-300"
            >
              Upload Receipt → Earn Points
              <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* How it Works */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-2xl bg-gray-900 border border-gray-800">
              <Upload className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">1. Upload</h3>
              <p className="text-gray-400">Take a photo of your receipt from any dispensary or restaurant</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gray-900 border border-gray-800">
              <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">2. AI Processing</h3>
              <p className="text-gray-400">Our AI reads your receipt and awards points automatically</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gray-900 border border-gray-800">
              <Gift className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3. Redeem</h3>
              <p className="text-gray-400">Use your points for shoutouts, bonus clips, and sticker packs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      {featuredPartners && featuredPartners.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Partners</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPartners.map((partner) => (
                <div key={partner.id} className="text-center p-6 rounded-2xl bg-gray-800 border border-gray-700">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                  <p className="text-gray-400 capitalize">{partner.kind}</p>
                  <p className="text-sm text-gray-500 mt-2">{partner.city}, {partner.state}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Points System */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Earn Points</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
              <h3 className="text-xl font-bold mb-4 text-green-500">Dispensary Receipts</h3>
              <p className="text-gray-400 mb-4">Get 10 points for every dispensary receipt</p>
              <div className="text-2xl font-bold">+10 Points</div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
              <h3 className="text-xl font-bold mb-4 text-purple-500">Restaurant Receipts</h3>
              <p className="text-gray-400 mb-4">Get 8 points for every restaurant receipt</p>
              <div className="text-2xl font-bold">+8 Points</div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 md:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-yellow-500">Combo Bonus</h3>
              <p className="text-gray-400 mb-4">Get both types approved within 48 hours for a bonus</p>
              <div className="text-2xl font-bold">+15 Bonus Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Preview */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Redeem Rewards</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-gray-800 border border-gray-700">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Shoutout</h3>
              <p className="text-gray-400 mb-4">Get featured on our social media</p>
              <div className="text-2xl font-bold text-yellow-500">50 Points</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gray-800 border border-gray-700">
              <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Bonus Clip</h3>
              <p className="text-gray-400 mb-4">Exclusive bonus content access</p>
              <div className="text-2xl font-bold text-purple-500">75 Points</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gray-800 border border-gray-700">
              <Gift className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Sticker Pack</h3>
              <p className="text-gray-400 mb-4">Physical sticker pack mailed to you</p>
              <div className="text-2xl font-bold text-green-500">150 Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the DankPass loyalty program and start earning points from your everyday purchases.
          </p>
          <Link 
            href="/upload"
            className="inline-block px-12 py-6 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl text-white font-bold text-xl hover:scale-105 transition-all duration-300"
          >
            Upload Your First Receipt
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 DankPass. Part of the DankNDevour ecosystem.
          </p>
        </div>
      </footer>
    </div>
  )
}