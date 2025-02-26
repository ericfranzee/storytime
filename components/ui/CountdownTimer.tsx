'use client';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface CountdownTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
}

export default function CountdownTimer({ duration, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      setProgress((timeLeft / duration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, duration, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-center text-sm text-muted-foreground">
        Video processing: {minutes}:{seconds.toString().padStart(2, '0')} remaining
      </p>
    </div>
  );
}
