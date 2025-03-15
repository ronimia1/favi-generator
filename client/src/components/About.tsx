import { CheckCircle } from "lucide-react";

export default function About() {
  const benefits = [
    "Time-saving bulk processing capabilities",
    "Multiple size generation for cross-platform compatibility",
    "Support for all common image formats",
    "Private, browser-based processing for maximum security",
    "Convenient one-click download of all generated files"
  ];

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About FaviMaker</h2>
            <p className="text-gray-700 mb-4">
              FaviMaker is a powerful online tool designed to simplify the process of creating 
              favicons for your websites and web applications. We understand the importance of 
              having consistent branding across all platforms, which is why we've created this 
              bulk conversion tool.
            </p>
            <p className="text-gray-700 mb-4">
              Our generator produces high-quality favicons in multiple sizes to ensure 
              compatibility with all browsers and devices. Whether you're developing a single 
              website or managing multiple web projects, FaviMaker helps you create professional 
              favicons quickly and efficiently.
            </p>
            <p className="text-gray-700">
              All processing is done directly in your browser, meaning your images never leave 
              your computer. This ensures complete privacy and security for your design assets.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Key Benefits</h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 mr-2" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
