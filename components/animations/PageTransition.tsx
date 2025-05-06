'use client';
import { useRef } from 'react';
import { domAnimation, LazyMotion, m } from 'framer-motion';
import type { ReactNode } from 'react';

const PageTransition = ({ children }: { children: ReactNode }) => {
  const ref = useRef(null);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};

export default PageTransition;
