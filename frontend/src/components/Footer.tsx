import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#050E3C] to-[#050E3C] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#050E3C] font-bold text-xl"><Brain /></span>
              </div> */}
              <span className="text-2xl font-bold">INDX</span>
            </div>
            <p className="text-blue-100">
              AI-powered testing platform for modern education and professional development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-blue-100 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-blue-100 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/demo" className="text-blue-100 hover:text-white transition-colors">Test Platform</Link></li>
              <li><Link href="/test-dashboard" className="text-blue-100 hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Series</h3>
            <ul className="space-y-2 text-blue-100">
              <li>Series S</li>
              <li>Series B</li>
              <li>Series C</li>
            </ul>
          </div>

          {/* Contact */}
          {/* <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#050E3C] rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#050E3C] rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#050E3C] rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#050E3C] rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div> */}
        </div>

        <div className="border-t border-[#050E3C] mt-8 pt-8 text-center text-blue-100">
          <p>&copy; 2025 INDX Test Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}