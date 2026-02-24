import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Hero Background Images with fade effect */}
      <div className="absolute inset-0">
        {Array.from({ length: totalImages }).map((_, index) => (
        <img
        key={index}
        src={`/heroImages/${index}.jpg`}
        alt={`Hero Image ${index}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity [transition-duration:5000ms] ease-in-out ${
          index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      />
      
        ))}
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20"></div>

      {/* Hero Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white z-30">
        <div className="max-w-3xl">
          <h1 className="font-caveat text-7xl font-bold md:text-7xl mb-4 leading-tight">
            Discover your wild side<br />
            Explore the diverse cultures<br />
            and wildlife of Sri Lanka
          </h1>
          <a
            href="#tours"
            className="bg-white hover:bg-safari-gold text-black px-8 py-3 rounded text-lg font-medium transition-colors inline-block"
          >
            Explore Tours
          </a>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
        {Array.from({ length: totalImages }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentImageIndex ? 'bg-white' : 'bg-gray-500'
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
}
