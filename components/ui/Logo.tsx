import { useTheme } from 'next-themes';
import Image from 'next/image';
import { imageConfig } from '@/config/images';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = '', showText = true }: LogoProps) => {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative w-[100px] h-[40px] md:h-[50px]">
        {/* Desktop Logo */}
        <Image
          src={theme === 'dark' ? imageConfig.logo.desktop.dark : imageConfig.logo.desktop.light}
          alt="Story Time"
          fill
          className="hidden md:block object-contain"
          priority
          sizes="(max-width: 768px) 0px, 100px"
        />
        {/* Mobile Logo */}
        <Image
          src={theme === 'dark' ? imageConfig.logo.mobile.dark : imageConfig.logo.mobile.light}
          alt="Story Time"
          fill
          className="block md:hidden object-contain"
          priority
          sizes="(max-width: 768px) 80px, 0px"
        />
      </div>
      {showText && <span className="text-xl font-bold">Story Time</span>}
    </div>
  );
};

export default Logo;
