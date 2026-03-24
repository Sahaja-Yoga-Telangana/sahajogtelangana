'use client'  // Add this line at the top of the file

import React from 'react'

const IntroButton = () => {
  const downloadPDF = (filename: string) => {
    // Create a link element
    const link = document.createElement('a');
    link.href = `/${filename}`; // Assuming the PDFs are in the public folder
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <section className="py-10 lg:py-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[color:var(--ink)]">
            Download the Introduction Booklet
          </h2>
          <p className="mt-3 text-[color:var(--muted)]">
            A gentle overview of Sahaja Yoga and how to begin your meditation practice.
          </p>
          <div className="flex flex-col mt-5 w-full gap-3 sm:flex-row items-center justify-center">
            <button
              onClick={() => downloadPDF('hindi-booklet.pdf')}
              className="flexCenter gap-3 rounded-full btn_green"
            >
              Hindi
            </button>
            <button
              onClick={() => downloadPDF('eng-booklet.pdf')}
              className="flexCenter gap-3 rounded-full btn_green"
            >
              English
            </button>
            <button
              onClick={() => downloadPDF('telugu-booklet.pdf')}
              className="flexCenter gap-3 rounded-full btn_green"
            >
              Telugu
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IntroButton
