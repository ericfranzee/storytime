"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideUp, scale, containerStagger, itemFadeIn } from '@/lib/animation-variants';
import AnimatedButton from '@/components/ui/animations/AnimatedButton';
import ProgressBar from '@/components/ui/animations/ProgressBar';
import SuccessCheckmark from '@/components/ui/animations/SuccessCheckmark';
import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"; // Update this import
import LoginModal from "@/components/LoginModal"
import axios, { AxiosResponse } from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { voiceOptions } from "./voice-options"
import { getFirestore, doc, getDoc, setDoc, increment, DocumentData } from "firebase/firestore";
import { getUserSubscription, incrementVideoUsage } from "@/app/firebase";
import { showToast } from "@/lib/toast-utils";
import ErrorAlert from '@/components/ui/feedback/ErrorAlert';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import ProcessingSteps from '@/components/ui/loading/ProcessingSteps';
import SuccessAlert from '@/components/ui/feedback/SuccessAlert';
import LoadingOverlay from '@/components/ui/loading/LoadingOverlay';
import { generateGeminiResponse } from '@/lib/gemini-utils';
import { Loader2 } from "lucide-react"; // For loading spinner
import { checkRateLimit, getRemainingLimit, getResetTime } from '@/lib/rate-limiter';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { Checkbox } from "@/components/ui/checkbox";

const MAX_CHARACTERS = 1500
const storyTypes = ["African Folktales", "History", "News", "Bedtime Stories"]
const defaultStoryType = "African Folktales"
let audio: HTMLAudioElement | null = null;
let voiceAudio: HTMLAudioElement | null = null;

export default function StoryToVideo() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [subscription, setSubscription] = useState<DocumentData | null>(null);
  const [isUnrestricted, setIsUnrestricted] = useState(false);
  const unrestrictedEmails = process.env.UNRESTRICTED_EMAILS ? JSON.parse(process.env.UNRESTRICTED_EMAILS) : [];
  const db = getFirestore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Add this state
  const [error, setError] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState([
    { label: 'Analyzing story content', status: 'waiting' },
    { label: 'Generating video scenes', status: 'waiting' },
    { label: 'Processing audio', status: 'waiting' },
    { label: 'Finalizing video', status: 'waiting' }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const processingStages = {
    ANALYZING: 'Analyzing your story content...',
    GENERATING: 'Generating video scenes...',
    AUDIO: 'Processing audio and voiceover...',
    FINALIZING: 'Finalizing your video...'
  };

  useEffect(() => {
    if (user) {
      setIsUnrestricted(unrestrictedEmails.includes(user.email));
      const fetchSubscription = async () => {
        const sub = await getUserSubscription(user.uid);
        setSubscription(sub);
      };
      fetchSubscription();
    }
  }, [user, db, unrestrictedEmails]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const [isMounted, setIsMounted] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [story, setStory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitTime, setWaitTime] = useState(600); // 10 minutes in seconds
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [music, setMusic] = useState("1");
  const [musicUrl, setMusicUrl] = useState("");
  const [voice, setVoice] = useState("en-US-Andrew");
  const { toast } = useToast();
  const [showMusicUrlInput, setShowMusicUrlInput] = useState(false);
  const [apiMusicUrls, setApiMusicUrls] = useState({}); // State to store music URLs from API
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [emailNotify, setEmailNotify] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    async function fetchWebhookUrl() {
      const response = await fetch('/api/webhook-url');
      const data = await response.json();
      setWebhookUrl(data.webhookUrl);
    }
    fetchWebhookUrl();
  }, []);

  useEffect(() => {
    const fetchMusicUrls = async () => {
      try {
        const response = await fetch('/api/music-urls');
        const data = await response.json();
        setApiMusicUrls(data.musicUrls);
      } catch (error) {
        console.error("Error fetching music URLs:", error);
        toast({
          title: "Error",
          description: "Failed to load music options.",
          variant: "destructive",
        });
      }
    };

    fetchMusicUrls();
  }, []);

  const musicOptions = [
    { value: "1", label: "Joyfull" },
    { value: "2", label: "Horror" },
    { value: "3", label: "Piano" },
    { value: "4", label: "Natural" },
    { value: "5", label: "Love" },
    { value: "others", label: "Others" },
  ]

  const handleMusicPreview = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    let playUrl = music === "others" ? musicUrl : apiMusicUrls[music as keyof typeof apiMusicUrls];

    if (!playUrl) {
      showToast.error("Preview Failed", "No music URL available for this option.");
      return;
    }

    try {
      if (audioRef.current.src !== playUrl) {
        audioRef.current.src = playUrl;
      }

      if (!isAudioPlaying) {
        await audioRef.current.play();
        setIsAudioPlaying(true);
      } else {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    } catch (e) {
      console.error("Error playing music:", e);
      showToast.error("Preview Failed", "Could not play the selected music.");
    }
  };

  const updateProcessingStep = (index: number, status: 'waiting' | 'processing' | 'completed' | 'error') => {
    setProcessingSteps(steps =>
      steps.map((step, i) =>
        i === index ? { ...step, status } : step
      )
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!story.trim()) {
      errors.story = 'Story content is required';
    }
    if (story.length > MAX_CHARACTERS) {
      errors.story = 'Story exceeds maximum length';
    }
    if (!selectedStoryType) {
      errors.storyType = 'Please select a story type';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendEmailNotification = async (videoUrl: string) => {
    if (!user?.email || !emailNotify) return;

    try {
      const response = await fetch('/api/notify/video-ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, videoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email notification');
      }

      showToast.success(
        "Notification Sent",
        "You'll receive an email when your video is ready"
      );
    } catch (error) {
      showToast.error(
        "Notification Failed",
        "Couldn't send email notification"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!subscription) {
      setError('sub/subscription-required');
      return;
    }

    if (!isUnrestricted && subscription.usage >= subscription.videoLimit) {
      setError('sub/limit-reached');
      return;
    }

    if (story.length > MAX_CHARACTERS || story.length === 0) {
      setError('video/invalid-input');
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      // Update processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        updateProcessingStep(i, 'processing');

        // Simulate processing time for each step
        await new Promise(resolve => setTimeout(resolve, 3000));

        updateProcessingStep(i, 'completed');
      }

      const musicParameter = music === "others" ? musicUrl : music;

      let response: AxiosResponse<any>;
      try {
        response = await axios.post(webhookUrl, {
          story: story,
          music: musicParameter,
          voice: voice,
          storyType: selectedStoryType,
        }, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setProgress(percentCompleted);
          },
        });

        // Only increment usage if we got a successful response with a video URL
        if (response.data.videoUrl) {
          await incrementVideoUsage(user.uid);
          setVideoUrl(response.data.videoUrl);
          showToast.success("Video Generation Started", "Your video is being processed.");

          // Send email notification when countdown starts
          if (emailNotify) {
            await sendEmailNotification(response.data.videoUrl);
          }

          // Start the timer
          setIsWaiting(true);
          setIsLoadingVideo(true);
          const interval = setInterval(() => {
            setCountdown((prevCountdown) => {
              if (prevCountdown <= 1) {
                clearInterval(interval);
                setIsWaiting(false);
                setIsLoadingVideo(false);
                setVideoUrl(response.data.videoUrl);
                showToast.success("Video Ready", "Your video is ready for download.");
                return 0;
              }
              return prevCountdown - 1;
            });
            setWaitTime((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(interval);
                setIsWaiting(false);
                setIsLoadingVideo(false);
                setVideoUrl(response.data.videoUrl);
                showToast.success("Video Ready", "Your video is ready for download.");
                return 0;
              }
              return prevTime - 1;
            });
          }, 1000);
        }
      } catch (error) {
        showToast.error("Generation Failed", "Could not generate video. Please try again.");
      } finally {
        setIsLoading(false);
      }

      setSuccessMessage('Your video has been generated successfully!');
    } catch (error: any) {
      processingSteps.forEach((_, index) => {
        if (index >= currentStep) {
          updateProcessingStep(index, 'error');
        }
      });
      setError(error.code || 'video/generation-failed');
      showToast.error(
        "Generation Failed",
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl)
    showToast.success("Link Copied", "Video link copied to clipboard.");
  }

  const [isPlaying, setIsPlaying] = useState(false);

  const handleVoicePreview = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling

    if (!voiceAudioRef.current) {
      voiceAudioRef.current = new Audio();
    }

    const voiceUrl = process.env.NEXT_PUBLIC_VOICE_URL?.replace('{value}', voice);
    if (!voiceUrl) {
      showToast.error("Error", "Voice URL is not configured.");
      return;
    }

    try {
      if (voiceAudioRef.current.src !== voiceUrl) {
        voiceAudioRef.current.src = voiceUrl;
      }

      if (isPlaying) {
        voiceAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        await voiceAudioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing voice:", error);
      showToast.error("Error", "Failed to play voice preview.");
    }
  };

  useEffect(() => {
    setShowMusicUrlInput(music === "others");
  }, [music]);

  const [selectedStoryType, setSelectedStoryType] = useState(defaultStoryType);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
    };
  }, []);

  const generateStoryPrompt = async () => {
    if (!user) {
      setShowLoginModal(true);
      showToast.error("Authentication Required", "Please login to generate stories");
      return;
    }

    if (!selectedStoryType) {
      showToast.error("Error", "Please select a story type first");
      return;
    }

    // Check rate limit
    if (!checkRateLimit(user.uid)) {
      const resetTimeMs = getResetTime(user.uid);
      const resetTimeSeconds = Math.ceil(resetTimeMs / 1000);
      showToast.error(
        "Rate Limit Exceeded",
        `Please wait ${resetTimeSeconds} seconds before generating another story. Limit: 5 generations per minute.`
      );
      return;
    }

    const remainingLimit = getRemainingLimit(user.uid);
    setIsGeneratingStory(true);

    try {
      const prompt = `Create a ${selectedStoryType} story between 400-800 characters without headings or greetings.
      If it's an African Folktale:
      - Set in a traditional African village or wilderness
      - Include cultural elements like traditional names, customs, and beliefs
      - Feature animals, spirits, or village life
      - Add a happy ending that reflects community values
      
      If it's History:
      - Focus on a specific moment in time (year, era, or period)
      - Include authentic historical figures and locations
      - Describe the atmosphere, clothing, and setting of the time
      - Show how this moment changed the course of events
      
      If it's News:
      - Write as a human interest story
      - Include specific dates, locations, and relevant people
      - Focus on the emotional impact and community response
      - Provide context and resolution to the event
      
      If it's a Bedtime Story:
      - Create a gentle, warmhearted narrative
      - Include friendly characters (animals, children, or magical beings)
      - Use soothing descriptions and peaceful settings
      - End with characters feeling safe and content
      
      Keep the narrative flowing naturally without sections or breaks. Focus on vivid details and emotional connections.`;

      const response = await generateGeminiResponse(prompt);

      if (response.success) {
        setStory(response.text);
        showToast.success(
          "Story Generated",
          `Story created successfully! You have ${remainingLimit} generations remaining this minute.`
        );
      } else {
        showToast.error("Generation Failed", response.error || "Failed to generate story");
      }
    } catch (error) {
      showToast.error(
        "Generation Failed",
        error instanceof Error ? error.message : "Failed to generate story"
      );
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="w-full mx-auto space-y-8 p-4 sm:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg relative" id="story"
    >
      {isLoading && (
        <LoadingOverlay
          isLoading={isLoading}
          message={processingStage || "Generating video..."}
        />
      )}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} setIsSignupModalOpen={() => { }} isOpen={showLoginModal} onLoginSuccess={() => { }} />}
      {error && (
        <ErrorAlert
          error={error}
          onClose={() => setError(null)}
          variant="inline"
        />
      )}
      {successMessage && (
        <SuccessAlert
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
          variant="inline"
        />
      )}
      <motion.div
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="flex flex-col space-y-4"
      >
        <motion.h1
          variants={itemFadeIn}
          className="text-4xl font-bold text-gray-900 dark:text-white"
        >
          Create Your Video
        </motion.h1>
        <motion.div
          variants={itemFadeIn}
          className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"
        >
          <h2 className="text-lg font-semibold mb-2">Tips for Better Results:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <li>Keep your story concise and focused</li>
            <li>Include key details and emotional moments</li>
            <li>Choose music that matches your story's mood</li>
            <li>Select a voice that fits your narrative style</li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.form
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <motion.div
          variants={containerStagger}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {storyTypes.map((type) => (
            <motion.div
              key={type}
              variants={itemFadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TooltipProvider key={type}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedStoryType === type ? "default" : "outline"}
                      onClick={() => setSelectedStoryType(type)}
                      className="rounded-full"
                    >
                      {type}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {getStoryTypeDescription(type)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemFadeIn}
          className="relative"
        >
          <div className="relative">
            <Textarea
              placeholder="Enter a summary message for the video to be generated..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              maxLength={MAX_CHARACTERS}
              className="min-h-[200px] w-full md:w-4/4 transition-all duration-200 focus:ring-2 focus:ring-blue-500 pr-12"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={generateStoryPrompt}
                    disabled={isGeneratingStory}
                  >
                    {isGeneratingStory ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                      </svg>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Generate a story for me</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute right-4 bottom-4 text-sm text-gray-500"
            >
              {story.length} / {MAX_CHARACTERS}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={containerStagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={itemFadeIn}>
            <label htmlFor="music" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Background Sound
            </label>
            <div className="flex items-start sm:items-center md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <select
                id="music"
                className="block w-3/4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white mobile-margin-top"
                value={music}
                onChange={(e) => setMusic(e.target.value)}
              >
                {musicOptions.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button" // Explicitly set type to button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={handleMusicPreview}
                    >
                      {isMounted && isAudioPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M11 7H8V17H11V7Z" />{" "}
                          <path d="M13 17H16V7H13V17Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Preview Music
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>

          {showMusicUrlInput && (
            <motion.div variants={itemFadeIn}>
              <Label htmlFor="music-url" className="text-gray-900 dark:text-white">Music URL</Label>
              <Input
                id="music-url"
                type="url"
                placeholder="https://location.com/music.mp3"
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                className="text-gray-900 dark:text-white"
              />
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Make sure the link to music is public.
              </p>
            </motion.div>
          )}

          <motion.div variants={itemFadeIn}>
            <label htmlFor="voice" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Voice
            </label>
            <div className="flex items-start sm:items-center md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <select
                id="voice"
                className="block w-3/4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white mobile-margin-top"
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
              >
                {voiceOptions.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button" // Explicitly set type to button
                      variant="outline"
                      size="icon"
                      className="ml-2"
                      onClick={handleVoicePreview}
                    >
                      {isMounted && isPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M11 7H8V17H11V7Z" />{" "}
                          <path d="M13 17H16V7H13V17Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Preview Voice
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemFadeIn} className="mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailNotify"
              checked={emailNotify}
              onCheckedChange={(checked) => setEmailNotify(checked as boolean)}
            />
            <label 
              htmlFor="emailNotify"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Notify me by email when video is ready
            </label>
          </div>
        </motion.div>

        <motion.div variants={itemFadeIn}>
          <AnimatedButton
            type="submit"
            isLoading={isLoading}
            loadingText="Generating..."
            disabled={isLoading || isWaiting || story.length > MAX_CHARACTERS}
            className="w-full md:w-auto"
          >
            Generate Video
          </AnimatedButton>
        </motion.div>
      </motion.form>

      <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <ProgressBar
            value={progress}
            showValue
            color="bg-blue-500"
          />
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {videoUrl && (
          <motion.div
              variants={containerStagger}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <div className="my-8">
              <CountdownTimer
                duration={60} // 10 minutes in seconds
                onComplete={() => setIsVideoReady(true)}
              />
              <br />
              {isWaiting && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex space-x-2">
                  <motion.div
                    initial={{ width: "10%", backgroundColor: "#60a5fa" }}
                    animate={{
                      width: ["20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"],
                      backgroundColor: ["#3b82f6", "#60a5fa", "#3b82f6"]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                     className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                  />
                  <motion.div
                    initial={{ width: "10%", backgroundColor: "#60a5fa" }}
                    animate={{
                      width: ["20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"],
                      backgroundColor: ["#3b82f6", "#60a5fa", "#3b82f6"]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      delay: 2.5,
                      ease: "easeInOut"
                    }}
                    className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
        {isVideoReady && (
          <motion.div
            variants={scale}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <SuccessCheckmark />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Video is Ready!</h2>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              {isLoadingVideo ? (
                <div className="spinner"></div>
              ) : (
                <video controls className="w-full h-full">
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="flex space-x-2">
              <Button asChild className="flex-1 ">
                <a target="_blank" href={videoUrl} download>
                  Download Video
                </a>
              </Button>
              <Button onClick={handleCopyLink} className="">
                Copy Link
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function getStoryTypeDescription(type: string): string {
  const descriptions = {
    "African Folktales": "Traditional stories passed down through generations, rich in culture and wisdom",
    "History": "Historical events and figures brought to life through compelling visuals",
    "News": "Current events transformed into engaging video content",
    "Bedtime Stories": "Soothing tales perfect for children's entertainment and education"
  };
  return descriptions[type as keyof typeof descriptions] || "";
}
