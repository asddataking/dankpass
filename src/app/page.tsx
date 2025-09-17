import Link from 'next/link';
import { ArrowRight, QrCode, Star, Users, Zap } from 'lucide-react';
import { SignIn } from '@stackframe/stack';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
        
        {/* Neon Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-cyan/10"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-glow">
            <h1 className="text-6xl md:text-8xl font-retro font-bold mb-6 bg-neon-gradient bg-clip-text text-transparent">
              DankPass
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl font-neon mb-8 text-gray-300 max-w-3xl mx-auto">
            Collect your highs. Unlock the culture.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/handler/sign-in"
              className="group px-8 py-4 bg-neon-gradient rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-neon-pink/50"
            >
              Start Your Journey
              <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/passport"
              className="px-8 py-4 border-2 border-neon-cyan rounded-2xl text-neon-cyan font-bold text-lg hover:bg-neon-cyan hover:text-black transition-all duration-300"
            >
              View Passport
            </Link>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <QrCode className="w-12 h-12 text-neon-pink opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Star className="w-8 h-8 text-neon-cyan opacity-60" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Zap className="w-10 h-10 text-neon-purple opacity-60" />
        </div>
      </section>

      {/* What is DankPass Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-retro font-bold text-center mb-16 bg-neon-gradient-horizontal bg-clip-text text-transparent">
            What is DankPass?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-dark-surface border border-dark-border hover:border-neon-pink transition-all duration-300 group">
              <QrCode className="w-16 h-16 text-neon-pink mx-auto mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl font-bold mb-4">QR Scanning</h3>
              <p className="text-gray-400">Scan QR codes at dispensaries, events, and lodging to collect stamps in your digital passport.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-dark-surface border border-dark-border hover:border-neon-cyan transition-all duration-300 group">
              <Star className="w-16 h-16 text-neon-cyan mx-auto mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl font-bold mb-4">Strain Logging</h3>
              <p className="text-gray-400">Track your cannabis experiences with detailed strain information, terpenes, and personal notes.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-dark-surface border border-dark-border hover:border-neon-purple transition-all duration-300 group">
              <Users className="w-16 h-16 text-neon-purple mx-auto mb-6 group-hover:animate-pulse" />
              <h3 className="text-2xl font-bold mb-4">Community</h3>
              <p className="text-gray-400">Connect with fellow connoisseurs and discover new experiences through our community features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-r from-neon-pink/5 to-neon-cyan/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-retro font-bold text-center mb-16">
            How it Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your account with email magic link" },
              { step: "2", title: "Scan", desc: "Scan QR codes at partner locations" },
              { step: "3", title: "Collect", desc: "Earn stamps and badges in your passport" },
              { step: "4", title: "Share", desc: "Share your achievements and discoveries" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connoisseur Perks Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-retro font-bold text-center mb-16">
            Connoisseur Perks
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Premium Strains", desc: "Access to exclusive strain information and reviews" },
              { title: "Event Access", desc: "Early access to cannabis events and meetups" },
              { title: "Lodging Deals", desc: "Special rates at cannabis-friendly accommodations" },
              { title: "Community Features", desc: "Connect with other connoisseurs and share experiences" },
              { title: "Analytics", desc: "Track your consumption patterns and preferences" },
              { title: "Support", desc: "Priority customer support and assistance" }
            ].map((perk, index) => (
              <div key={index} className="p-6 rounded-2xl bg-dark-surface border border-dark-border hover:border-neon-green transition-all duration-300">
                <h3 className="text-xl font-bold mb-3 text-neon-green">{perk.title}</h3>
                <p className="text-gray-400">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-neon-pink/10 to-neon-cyan/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-retro font-bold mb-8">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of cannabis connoisseurs who are already collecting, sharing, and discovering with DankPass.
          </p>
          <Link 
            href="/auth/signin"
            className="inline-block px-12 py-6 bg-neon-gradient rounded-2xl text-white font-bold text-xl hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-neon-pink/50"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-dark-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 DankPass. Part of the DankNDevour ecosystem.
          </p>
        </div>
      </footer>
    </div>
  );
}