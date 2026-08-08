'use client'

import { useRouter } from 'next/navigation';
import Image from "next/image";

type ButtonProps = {
  type: 'button' | 'submit';
  title: string;
  icon?: string;
  variant: string;
  full?: boolean;
  href?: string;
  externalHref?: string;
}

const Button = ({ type, title, icon, variant, full, href, externalHref }: ButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (externalHref) {
      window.location.href = externalHref;
      return;
    }

    if (href) {
      router.push(href);
    }
  }

  const variantClass = {
    primary: 'bg-[color:var(--primary)] text-[color:var(--on-primary)] hover:bg-[color:var(--primary-600)]',
    secondary: 'border border-[color:var(--border)] text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]',
    ghost: 'text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]',
  }[variant] || 'bg-[color:var(--primary)] text-[color:var(--on-primary)] hover:bg-[color:var(--primary-600)]';

  return (
    <button
      className={`inline-flex items-center w-full sm:w-auto justify-center gap-3 rounded-full px-6 py-3 text-base font-medium transition ${variantClass} ${full && 'w-full'}`}
      type={type}
      onClick={handleClick}
    >
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <span className="whitespace-nowrap">{title}</span>
    </button>
  )
}

export default Button;
