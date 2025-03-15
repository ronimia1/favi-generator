import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <h1 className="text-xl font-bold text-gray-900">FaviMaker</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-600 hover:text-primary font-medium">Home</a></li>
              <li><a href="#tool" className="text-gray-600 hover:text-primary font-medium">Generator</a></li>
              <li><a href="#faq" className="text-gray-600 hover:text-primary font-medium">FAQ</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-primary font-medium">About</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
