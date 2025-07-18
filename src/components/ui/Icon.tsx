import Image from 'next/image';

interface IconProps {
  name: 'user' | 'gear' | 'building' | 'car' | 'noteblock' | 'user-LM' | 'ms_signin';
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className = '' }: IconProps) {
  return (
    <Image
      src={`/assets/images/icons/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  );
}

interface LogoProps {
  variant?: 'green' | 'off-white';
  width?: number;
  height?: number;
  className?: string;
}

export function WolthersLogo({ variant = 'green', width = 120, height = 32, className = '' }: LogoProps) {
  return (
    <Image
      src={`/assets/images/logos/wolthers-logo-${variant}.svg`}
      alt="Wolthers Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}