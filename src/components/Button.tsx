'use client'

import { useRouter } from 'next/navigation';
import Image from "next/image";

type ButtonProps = {
  type: 'button' | 'submit';
  title: string;
  icon?: string;
  variant: string;
  full?: boolean;
}

const Button = ({ type, title, icon, variant, full }: ButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (title === "Centers Near Me") {
      router.push('/centers');
    }

    else if(title === "Know More"){
      router.push('/shri-mataji')
    }
    else if(title === "Read More"){
      router.push('/sahaja-yoga')
    }
    else if(title === "Corporate Program"){
      router.push('/corporate-register')
    }
    else if(title === "Meditate Now!"){
      router.push('/sahaja-yoga')
    }
    else if(title === "Read More 🍏"){
      window.location.href = "https://sahajakrishi.in/";
    }
  }

  const variantClass = {
    primary: 'bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-600)]',
    secondary: 'border border-[color:var(--border)] text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]',
    ghost: 'text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]',
  }[variant] || 'bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-600)]';

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
