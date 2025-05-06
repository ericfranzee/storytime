import React from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoScaleProps {
  value: string;
  onChange: (value: string) => void;
}

const VideoScaleOptions: React.FC<VideoScaleProps> = ({ value, onChange }) => {
  const scaleOptions = [
    {
      id: 'landscape',
      title: 'Landscape (16:9)',
      description: 'Best for desktop & TV e.g: YouTube (1920x1080)',
      icon: (
        <svg className="w-12 h-8" viewBox="0 0 24 16" fill="none" stroke="currentColor">
          <rect x="1" y="1" width="22" height="14" rx="1" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'vertical',
      title: 'Vertical (9:16)',
      description: 'Optimized for mobile e.g: Tiktok (1080x1920)',
      icon: (
        <svg className="w-8 h-12" viewBox="0 0 16 24" fill="none" stroke="currentColor">
          <rect x="1" y="1" width="14" height="22" rx="1" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">
        Video Scale
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4"
      >
        {scaleOptions.map((option) => (
          <TooltipProvider key={option.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Label
                    htmlFor={option.id}
                    className={`
                      flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer
                      ${value === option.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'}
                    `}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="sr-only"
                    />
                    {option.icon}
                    <span className="mt-2 font-medium">{option.title}</span>
                  </Label>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>{option.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </RadioGroup>
    </div>
  );
};

export default VideoScaleOptions;
