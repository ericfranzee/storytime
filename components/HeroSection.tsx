"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { throttle } from 'lodash';

const HeroSection = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = throttle(() => {
      setIsMobile(window.innerWidth < 768);
    }, 200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let currentMountRef = mountRef.current;
    return () => {
      if (currentMountRef) {
        // Cleanup code here
      }
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
    // Reduce particle count for better performance
    const SEPARATION = 120;
    const AMOUNTX = isMobile ? 15 : 20;
    const AMOUNTY = isMobile ? 15 : 20;
    const particles: THREE.Mesh[] = [];
    const count = 0;

    const init = () => {
      container = document.createElement('div');
      if (mountRef.current) {
        mountRef.current.appendChild(container);
      }

      camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 8000);
      camera.position.z = 800;

      scene = new THREE.Scene();
      
      const geometry = new THREE.SphereGeometry(1, 16, 16); // Reduced geometry complexity
      const material = new THREE.MeshBasicMaterial({
        color: theme === 'dark' ? 0xffffff : 0x000000,
        transparent: true,
        opacity: 0.8,
      });

      // Create particles with optimized creation
      const particleSystem = new THREE.Group();
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const particle = new THREE.Mesh(geometry, material);
          particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          particles.push(particle);
          particleSystem.add(particle);
        }
      }
      scene.add(particleSystem);

      renderer = new THREE.WebGLRenderer({ 
        antialias: false, 
        powerPreference: "high-performance",
        alpha: true 
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      const throttledMouseMove = throttle(onDocumentMouseMove, 16);
      document.addEventListener('mousemove', throttledMouseMove);
      
      const debouncedResize = throttle(onWindowResize, 200);
      window.addEventListener('resize', debouncedResize);
      
      setIsLoading(false);
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
      if (!renderer) return;
      
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      const i = 0;
      const time = Date.now() * 0.001;
      
      particles.forEach((particle, i) => {
        const ix = Math.floor(i / AMOUNTY);
        const iy = i % AMOUNTY;
        particle.position.y = (Math.sin((ix + time) * 0.3) * 50) + (Math.sin((iy + time) * 0.5) * 50);
        particle.scale.setScalar((Math.sin((ix + time) * 0.3) + 2) * 2 + (Math.sin((iy + time) * 0.5) + 2) * 2);
      });

      renderer.render(scene, camera);
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
  }, [theme, isMobile]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="absolute top-[50px] text-center z-10 w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl bg-clip-text animate-fade-in">
          Transform Your Stories<br/>into Stunning Videos
        </h1>
        <p className="mb-20 mt-6 text-lg sm:text-xl md:text-xl animate-fade-in delay-100 max-w-2xl mx-auto">
          Harness the power of AI to turn your African stories, history, and news into captivating videos. 
          Perfect for content creators, educators, and storytellers.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-200">
          <button
            className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all"        >
            <a 
            href="#story"
          >
            Start Creating Now
            </a>
          </button>
          <a 
            href="#demo"
            className="px-8 py-4 bg-transparent border-2 rounded-full text-lg font-semibold hover:bg-gray-500 transition-all"
          >
            Watch Demo
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <h3 className="text-2xl font-bold">3K+</h3>
            <p>Videos Created</p>
          </div>
          <div className="p-4">
            <h3 className="text-2xl font-bold">500+</h3>
            <p>Happy Users</p>
          </div>
          <div className="p-4">
            <h3 className="text-2xl font-bold">4.9/5</h3>
            <p>User Rating</p>
          </div>
        </div>
      </div>
      <div 
        ref={mountRef} 
        className={`relative z-0 w-full h-full transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`} 
      />
    </div>
  );
};

export default HeroSection;
