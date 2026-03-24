import React from 'react';

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-semibold text-[color:var(--ink)] mb-3">
        {title}
      </h2>
      <div className="flex items-center justify-center">
        <div className="w-24 h-px bg-[color:var(--accent)]"></div>
      </div>
    </div>
  );
};

export default SectionTitle; 
