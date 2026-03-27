import React from 'react';
import SectionTitle from './SectionTitle';

const VirtualTour = () => {
  return (
    <section id="VirtualTour" className="py-20 bg-[color:var(--surface-2)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionTitle title="Begin with a short guided meditation" />
        
        <div className="bg-[color:var(--surface)] border border-[color:var(--border)] shadow-soft rounded-3xl overflow-hidden p-6 md:p-10">
          <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/wIfjGQDAcdI?si=VpyUB-iWskYTRaJq"
              title="Virtual Tour of Sahaja Yoga Center"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            ></iframe>
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href="/meditate"
              className="bg-[color:var(--primary)] hover:bg-[color:var(--primary-600)] text-white font-medium px-8 py-3 rounded-full inline-flex items-center transition-colors"
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
