import React from 'react';
import SectionTitle from './SectionTitle';
import Image from 'next/image';

const AboutUs = () => {
  return (
    <section className="py-16 bg-[color:var(--surface-2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="About Us" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shrine Card */}
          <div className="bg-[color:var(--surface)] shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 relative rounded-full overflow-hidden border-3 border-[color:var(--accent)] shadow-card bg-[color:color-mix(in_srgb,var(--accent-200)_40%,transparent)] p-1">
                  <Image 
                    src="/shri-mataji2.jpg" 
                    alt="Shri Mataji at Chhindwara" 
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-[color:var(--ink)] mb-4">Shrine Chhindwara</h3>
              
              <p className="text-gray-700 mb-6 text-center">
                Shri Mataji was born as Nirmala Salve on March 21, 1923 to Shri 
                Prasad Rao and Mrs Cornelia Salve in Chhindwara city of Madhya 
                Pradesh. Chhindwara, located on the South-West region of 'Satpura 
                Range of Mountains' lies between latitude 21°23' and 22°49' North 
                and longitude 78°10' and 79°24' East. Mostly, dense forest covers 
                most of the area of the district.
              </p>
              
              <div className="flex justify-center">
                <a 
                  href="#" 
                  className="btn btn-primary hover:bg-[color:var(--primary-600)] transition-colors inline-flex items-center"
                >
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Sahaja Yoga Card */}
          <div className="bg-[color:var(--surface)] shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 relative rounded-full overflow-hidden border-3 border-[color:var(--accent)] shadow-card bg-[color:color-mix(in_srgb,var(--accent-200)_40%,transparent)] p-1">
                  <Image 
                    src="/shri-mataji5.jpg" 
                    alt="Shri Mataji Meditation" 
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-[color:var(--ink)] mb-4">Sahaja Yoga</h3>
              
              <p className="text-gray-700 mb-6 text-center">
                Sahaja Yoga is a method of achieving a unique state of meditation 
                through the connection of our innate spiritual energy (Kundalini) to 
                the all-pervading divine energy of the universe. This state, known as 
                thoughtless awareness, makes us peaceful, balanced and 
                integrated while improving our wellness and relationships over 
                time.
              </p>
              
              <div className="flex justify-center">
                <a 
                  href="#" 
                  className="btn btn-primary hover:bg-[color:var(--primary-600)] transition-colors inline-flex items-center"
                >
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 