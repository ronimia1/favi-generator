export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-indigo-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Bulk Image to Favicon Generator</h1>
          <p className="text-xl mb-8">
            Convert multiple images to favicons in different sizes with just a few clicks.
            Save time and ensure your website has the perfect icon across all platforms.
          </p>
          <a 
            href="#tool" 
            className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            Start Converting
          </a>
        </div>
      </div>
    </section>
  );
}
