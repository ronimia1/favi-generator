import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <h3 className="text-xl font-bold">FaviMaker</h3>
            </div>
            <p className="text-gray-400 mb-4">
              The easiest way to create favicons for your websites. Convert multiple images at once, 
              download in various sizes, and implement them with ease.
            </p>
            <p className="text-gray-400">&copy; {new Date().getFullYear()} FaviMaker. All rights reserved.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-150">Home</a></li>
              <li><a href="#tool" className="text-gray-400 hover:text-white transition duration-150">Generator</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition duration-150">FAQ</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition duration-150">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-150">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-150">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-150">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition duration-150">Blog</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
