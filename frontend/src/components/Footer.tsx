import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#050E3C] to-[#050E3C] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          {/* <div className="space-y-4">
            <div className="flex items-center space-x-2">
             
              <span className="text-2xl font-bold">INDX</span>
            </div>
          </div> */}

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-blue-100 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/mission" className="text-blue-100 hover:text-white transition-colors">Mission/Vision</Link></li>
              {/* <li><Link href="/informations" className="text-blue-100 hover:text-white transition-colors">Information</Link></li> */}
              <li><Link href="/partnerships" className="text-blue-100 hover:text-white transition-colors">Partenariats</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/demo" className="text-blue-100 hover:text-white transition-colors">Plateforme</Link></li>
              <li><Link href="/test-dashboard" className="text-blue-100 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/about" className="text-blue-100 hover:text-white transition-colors">À propos d’INDX</Link></li>
            </ul>
          </div>


          {/* Categories */}
          {/* <div>
            <h3 className="font-bold text-lg mb-4">Serie</h3>
            <ul className="space-y-2 text-blue-100">
              <li><Link href="/demo">Serie 1</Link></li>
              <li><Link href="/demo">Serie 2</Link></li>
              <li><Link href="/demo">Serie 3</Link></li>
            </ul>
          </div> */}

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
          <p>&copy; 2025 INDX. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}