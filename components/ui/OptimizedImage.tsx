import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

const OptimizedImage = ({ src, fallbackSrc = '/assets/images/placeholder.png', ...props }: OptimizedImageProps) => {
  return (
    <Image
      {...props}
      src={src}
      onError={(e) => {
        console.error("Failed to load image", src);
      }}
    />
  );
};

export default OptimizedImage;
