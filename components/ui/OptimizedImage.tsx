import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;  // Make alt required
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(props.fallbackSrc || '/placeholder.svg')}
    />
  );
};

export default OptimizedImage;
