import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '../../constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[color:var(--surface)] pt-12 pb-6 border-t border-[color:var(--border)]">
      <div className="shrine-container flex w-full flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="mb-6 md:mb-0 md:w-1/3">
            <Link href="/" className="mb-6 inline-block">
              <div className="relative h-12 w-48">
                <Image src="/logo-brown.svg" alt="Sahaja Yoga Telangana" fill className="object-contain" />
              </div>
            </Link>
            <p className="mt-4 text-[color:var(--muted)] text-base leading-relaxed">
              Sahaja Yoga is a unique method of meditation founded by Shri Mataji Nirmala Devi that allows us to attain a state of thoughtless awareness.
            </p>
            <div className="mt-6">
              <h4 className="text-[color:var(--ink)] font-semibold mb-3">Connect with us</h4>
              <ul className="flex gap-4">
                {SOCIALS.links.map((link, index) => (
                  <Link href="/" key={index} className="text-[color:var(--muted)] hover:text-[color:var(--ink)] transition-colors">
                    <Image src={link} alt="social" width={24} height={24} />
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          <div className='flex flex-wrap gap-10 md:flex-1 justify-between'>
            {FOOTER_LINKS.map((columns) => (
              <FooterColumn title={columns.title} key={columns.title}>
                <ul className="flex flex-col gap-3 text-[color:var(--muted)]">
                  {columns.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.path} 
                        className="text-base hover:text-[color:var(--ink)] hover:underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            <div className="flex flex-col gap-5">
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                <ul className="flex flex-col gap-3">
                  {FOOTER_CONTACT_INFO.links.map((link) => (
                    <li key={link.label} className="flex flex-col md:flex-row gap-1 text-base">
                      <span className="text-[color:var(--ink)] font-medium">
                        {link.label}:
                      </span>
                      <span className="text-[color:var(--muted)]">
                        {link.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>

        <div className="border-t border-[color:var(--border)] my-2" />
        <p className="text-base text-center text-[color:var(--muted)]">© 2025 Sahaja Yoga Telangana | All rights reserved</p>
      </div>
    </footer>
  )
}

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[color:var(--ink)] font-semibold">{title}</h4>
      {children}
    </div>
  )
}

export default Footer
