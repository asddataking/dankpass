import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto', 
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto'
};

export function Logo({ 
  size = 'lg', 
  showText = true, 
  href = '/', 
  className = '' 
}: LogoProps) {
  const logoElement = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="DankPass Logo"
        width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
      {showText && (
        <span className="text-brand-ink font-bold text-lg">
          DankPass
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
