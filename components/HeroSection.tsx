"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import SignupModal from '@/components/SignupModal';

const HeroSection = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuth();

  const handleSignupSuccess = () => {
    // Handle successful signup
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let container: HTMLDivElement;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
let SEPARATION = 100, AMOUNTX = 25, AMOUNTY = 25;
    let particles: THREE.Mesh[], particle: THREE.Mesh;
    let count = 0;

    const init = () => {
      container = document.createElement('div');
      if (mountRef.current) {
        mountRef.current.appendChild(container);
      }

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;

      scene = new THREE.Scene();

      particles = [];

      let i = 0;
      let geometry = new THREE.SphereGeometry(1, 32, 32);
      let material = new THREE.MeshBasicMaterial({
        color: theme === 'dark' ? 0xffffff : theme === 'light' ? 0x000000 : typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 0xffffff : 0x000000,
      });

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++] = new THREE.Mesh(geometry, material);
          particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          scene.add(particle);
        }
      }

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(theme === 'dark' ? 0x111827 : theme === 'light' ? 0xf3f3f3 : typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 0x111827 : 0xf3f3f3,);
      container.appendChild(renderer.domElement);

      document.addEventListener('mousemove', onDocumentMouseMove);
      window.addEventListener('resize', onWindowResize);
    };

    const onWindowResize = () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

const animate = () => {
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++];
          particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
          particle.scale.x = particle.scale.y = particle.scale.z = (Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4;
        }
      }

      renderer.render(scene, camera);
      count += 0.1;
  requestAnimationFrame(animate);
};

    init();
    animate();

    return () => {
      if (mountRef.current && container) {
        mountRef.current.removeChild(container);
      }
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', onWindowResize);
      // Dispose of Three.js objects
      particles.forEach(particle => {
        particle.geometry.dispose();
      });
      renderer.dispose();
    };
  }, [theme]);

return (
  <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500 overflow-hidden">
    <div
      className="absolute top-[50px] buttom-[100px] text-center z-10 max-w-4xl px-4"
      style={{
        transform: `translateY(${scrollPosition * 0.2}px)`,
      }}
    >
<h1 className="text-4xl font-bold sm:text-5xl md:text-6xl animate-fade-in" >Bring your story to life with Story time Africa</h1>
<p className="mt-4 text-lg sm:text-xl md:text-2xl animate-fade-in delay-100" > We help your imagination transform into reality, start for free today.</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mx-auto block animate-fade-in delay-200"
        onClick={() => {
          if (!user) {
            setShowSignupModal(true);
          } else {
            window.location.href = "#story";
          }
        }}
      >
        Create Video
      </button>
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          setIsLoginModalOpen={setIsLoginModalOpen}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </div>
    <div ref={mountRef} className={`hero-section ${theme === 'dark' ? 'dark' : 'light'} w-full h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)] md:h-[calc(100vh-250px)] flex items-center justify-center`} />
  </div>
);
};

export default HeroSection;
