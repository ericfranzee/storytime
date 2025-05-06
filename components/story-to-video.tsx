"use client";
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { fadeIn, slideUp, scale, containerStagger, itemFadeIn } from '@/lib/animation-variants';
import AnimatedButton from '@/components/ui/animations/AnimatedButton';
import ProgressBar from '@/components/ui/animations/ProgressBar';
import SuccessCheckmark from '@/components/ui/animations/SuccessCheckmark';
import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast";
import LoginModal from "@/components/LoginModal"
import axios, { AxiosResponse } from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { voiceOptions } from "./voice-options";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
  DocumentData,
} from "firebase/firestore";
import {
  getUserSubscription,
  incrementVideoUsage, // Ensure this function accepts an increment amount
  addVideoHistory,
} from "@/app/firebase";
import { showToast } from "@/lib/toast-utils";
import ErrorAlert from "@/components/ui/feedback/ErrorAlert";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import ProcessingSteps from "@/components/ui/loading/ProcessingSteps";
import SuccessAlert from "@/components/ui/feedback/SuccessAlert";
import LoadingOverlay from "@/components/ui/loading/LoadingOverlay";
import { generateGeminiResponse } from "@/lib/gemini-utils";
import { Loader2, ChevronRight, ChevronLeft, Wand2 } from "lucide-react";
import { checkRateLimit, getRemainingLimit, getResetTime } from "@/lib/rate-limiter";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Checkbox } from "@/components/ui/checkbox";
import VideoScaleOptions from "@/components/ui/VideoScaleOptions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup

const MAX_CHARACTERS = 1500;
const storyTypes = ["African Folktales", "History", "News", "Bedtime Stories"];
const defaultStoryType = "African Folktales";
const audio: HTMLAudioElement | null = null;
const voiceAudio: HTMLAudioElement | null = null;

const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
    {description && (
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    )}
  </div>
);

export default function StoryToVideo() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [subscription, setSubscription] = useState<DocumentData | null>(null);
  const [isUnrestricted, setIsUnrestricted] = useState(false);
  const unrestrictedEmails = process.env.NEXT_PUBLIC_UNRESTRICTED_EMAILS // Use NEXT_PUBLIC_ for client-side access
    ? JSON.parse(process.env.NEXT_PUBLIC_UNRESTRICTED_EMAILS)
    : [];
  const db = getFirestore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState([
    { label: "Analyzing story content", status: "waiting" },
    { label: "Generating video scenes", status: "waiting" },
    { label: "Processing audio", status: "waiting" },
    { label: "Finalizing video", status: "waiting" },
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [validationErrors, setValidationErrors] =
    useState<Record<string, string>>({});
  const [selectedStoryType, setSelectedStoryType] = useState(defaultStoryType);

  const processingStages = {
    ANALYZING: "Analyzing your story content...",
    GENERATING: "Generating video scenes...",
    AUDIO: "Processing audio and voiceover...",
    FINALIZING: "Finalizing your video...",
  };

  useEffect(() => {
    if (user?.email) { // Check if user and email exist
      setIsUnrestricted(unrestrictedEmails.includes(user.email));
      const fetchSubscription = async () => {
        if (user.uid) { // Ensure uid exists
            const sub = await getUserSubscription(user.uid);
            setSubscription(sub);
        }
      };
      fetchSubscription();
    } else {
        // Reset subscription if user logs out
        setSubscription(null);
        setIsUnrestricted(false);
    }
  }, [user, db]); // Removed unrestrictedEmails from dependency array as it's constant after build

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const [isMounted, setIsMounted] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  const [apiMusicUrls, setApiMusicUrls] = useState({});
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [emailNotify, setEmailNotify] = useState(false);
  const [videoScale, setVideoScale] = useState("landscape");
  const [videoLength, setVideoLength] = useState("default"); // 'default', 'medium', 'long'

  useEffect(() => {
    setIsMounted(true);

    async function fetchWebhookUrl() {
      try {
        const response = await fetch("/api/webhook-url");
        if (!response.ok) {
            throw new Error(`Webhook fetch failed: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.webhookUrl) {
            setWebhookUrl(data.webhookUrl);
        } else {
             console.error("Webhook URL not found in API response:", data);
             showToast.error("Config Error", "Could not load video generation endpoint.");
        }
      } catch (err) {
         console.error("Error fetching webhook URL:", err);
         showToast.error("Network Error", "Could not connect to fetch webhook URL.");
      }
    }
    fetchWebhookUrl();
  }, []);

  useEffect(() => {
    const fetchMusicUrls = async () => {
      try {
        const response = await fetch("/api/music-urls");
         if (!response.ok) {
            throw new Error(`Music URL fetch failed: ${response.statusText}`);
        }
        const data = await response.json();
        setApiMusicUrls(data.musicUrls || {}); // Ensure it's an object
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
  }, [toast]); // Added toast to dependency array

  const musicOptions = [
    { value: "1", label: "Joyfull" },
    { value: "2", label: "Horror" },
    { value: "3", label: "Piano" },
    { value: "4", label: "Natural" },
    { value: "5", label: "Love" },
    { value: "others", label: "Others" },
  ];

  const handleMusicPreview = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const playUrl =
      music === "others" ? musicUrl : apiMusicUrls[music as keyof typeof apiMusicUrls];

    if (!playUrl) {
      showToast.error("Preview Failed", "No music URL available for this option.");
      return;
    }

    try {
      if (audioRef.current.src !== playUrl) {
        audioRef.current.src = playUrl;
        // Reset playback state if source changes
        setIsAudioPlaying(false);
      }

      if (!isAudioPlaying) {
        await audioRef.current.play();
        setIsAudioPlaying(true);
      } else {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    } catch (err) {
      console.error("Error playing music:", err);
      showToast.error("Preview Failed", "Could not play the selected music.");
      setIsAudioPlaying(false); // Reset state on error
    }
  };

  const updateProcessingStep = (
    index: number,
    status: "waiting" | "processing" | "completed" | "error"
  ) => {
    setProcessingSteps((steps) =>
      steps.map((step, i) => (i === index ? { ...step, status } : step))
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!story.trim()) {
      errors.story = "Story content is required";
    }
    if (story.length > MAX_CHARACTERS) {
      errors.story = `Story exceeds maximum length of ${MAX_CHARACTERS} characters.`;
    }
    if (!selectedStoryType) {
      errors.storyType = "Please select a story type";
    }
    if (music === 'others' && !musicUrl.trim()) {
        errors.musicUrl = "Custom music URL is required when 'Others' is selected.";
    } else if (music === 'others' && musicUrl.trim()) {
        try {
            new URL(musicUrl); // Validate URL format
        } catch (_) {
            errors.musicUrl = "Invalid URL format for custom music.";
        }
    }


    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendEmailNotification = async (videoUrl: string) => {
    if (!user?.email || !emailNotify) return;

    try {
      const response = await fetch("/api/notify/video-ready", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, videoUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email notification");
      }

      showToast.success(
        "Notification Sent",
        "You'll receive an email when your video is ready"
      );
    } catch (error: any) { // Add type 'any'
      console.error("Error sending email notification:", error);
      // Attempt to get detailed error from response
      let detailedError = "Couldn't send email notification. Check server logs.";
      if (error instanceof Error && error.message.includes('Failed to send email notification')) {
          // Extract the specific error message if available in the format "Failed to send email notification: <specific_error>"
          const match = error.message.match(/Failed to send email notification: (.*)/);
          if (match && match[1]) {
              detailedError = `Notification Failed: ${match[1]}`;
          } else {
              // Fallback if parsing fails but the generic message is there
              detailedError = error.message;
          }
      } else if (error instanceof Error) {
          detailedError = error.message; // Use generic error message if it's a different error
      }

      showToast.error(
        "Notification Failed",
        detailedError // Display the detailed error
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setVideoUrl(""); // Clear previous video URL
    setIsVideoReady(false); // Reset video ready state

    if (!validateForm()) {
      // Show validation errors
      Object.values(validationErrors).forEach(errMsg => showToast.error("Validation Error", errMsg));
      return;
    }

    if (!isLoggedIn || !user) { // Ensure user object exists
      setShowLoginModal(true);
      return;
    }

    if (!subscription) {
      setError("Subscription details not loaded. Please wait or refresh.");
      showToast.error("Error", "Subscription details not loaded.");
      return;
    }

     // Determine usage increment based on video length
     let usageIncrement = 1;
     if (videoLength === 'medium') {
       usageIncrement = 2;
     } else if (videoLength === 'long') {
       usageIncrement = 3;
     }

    // Check limits before starting
    if (!isUnrestricted && (subscription.usage + usageIncrement) > subscription.videoLimit) {
      setError(`Generating this video requires ${usageIncrement} credits, but you only have ${subscription.remainingUsage} remaining.`);
      showToast.error("Limit Reached", `Generating this video requires ${usageIncrement} credits, but you only have ${subscription.remainingUsage} remaining.`);
      return;
    }

    if (!webhookUrl) {
        setError("Video generation endpoint is not configured correctly.");
        showToast.error("Configuration Error", "Video generation endpoint is missing.");
        return;
    }


    setIsLoading(true);
    setProgress(0);
    setProcessingSteps(steps => steps.map(s => ({ ...s, status: 'waiting' }))); // Reset steps

    try {
      // Update processing steps UI
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i); // This state seems unused, maybe remove?
        updateProcessingStep(i, "processing");
        // Simulate processing time - replace with actual progress updates if possible
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Shorter delay for UI
        updateProcessingStep(i, "completed");
      }

      const musicParameter = music === "others" ? musicUrl : music;

      // --- Prepare Payload ---
      // Sanitize story content for JSON compatibility (more aggressive)
      const sanitizedStory = story
        .replaceAll('\n', ' ')
        .replaceAll('\"', ' ') // Replace double quotes with space
       // .replaceAll('\'', ' ') // Replace single quotes with space
        .replaceAll(':', ' ') // Replace colons with space
        .replaceAll('-', ' ') // Replace hyphens with space
        .replaceAll('_', ' ') // Replace underscores with space
        .replaceAll('.', ' '); // Replace periods with space

      const payload: any = {
            story: sanitizedStory, // Use sanitized story
            music: musicParameter,
            voice: voice,
            storyType: selectedStoryType,
            vertical_video: videoScale === "vertical",
            pro_user: // This might be redundant if webhook handles logic based on plan/claims
              subscription.plan === "pro" ||
              subscription.plan === "elite",
      };
      // Conditionally add video_length if not default
      if (videoLength !== "default") {
          payload.video_length = videoLength;
      }
      // Add musicUrl only if 'others' is selected
      if (music === 'others') {
          payload.musicUrl = musicUrl;
      }

      // --- Call Webhook ---
      let response: AxiosResponse<any>;
      try {
        // console.log("Sending payload to webhook:", payload); // Removed for production
        response = await axios.post(webhookUrl, payload, {
            // Add timeout?
            // timeout: 60000, // e.g., 60 seconds
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                 const percentCompleted = Math.round(
                   (progressEvent.loaded * 100) / progressEvent.total
                 );
                 setProgress(percentCompleted);
              }
            },
          }
        );
        // console.log("Webhook response:", response.data); // Removed for production

        // --- Handle Response ---
        // Assuming webhook returns 200/202 on success with videoUrl
        if (response.status === 200 || response.status === 202) {
            if (response.data.videoUrl) {
                const receivedVideoUrl = response.data.videoUrl;
                const receivedVoiceUrl = response.data.voiceUrl || ''; // Handle optional voiceUrl

                // TODO: Confirm image URL structure from backend if needed
                const imageUrls: string[] = []; // Placeholder if backend doesn't return them

                // Add history and increment usage *after* successful generation confirmation
                await addVideoHistory(
                    user.uid,
                    receivedVideoUrl,
                    receivedVoiceUrl,
                    imageUrls, // Use actual image URLs if available
                    sanitizedStory, // Use sanitized story for history
                    musicParameter, // Use the parameter sent
                    voice,
                    videoScale
                );

                await incrementVideoUsage(user.uid, usageIncrement);

                // Update subscription state locally for immediate feedback
                setSubscription((prevSub: any) => ({
                    ...prevSub,
                    usage: (prevSub.usage || 0) + usageIncrement,
                    remainingUsage: (prevSub.remainingUsage || 0) - usageIncrement,
                    videoCount: (prevSub.videoCount || 0) + 1,
                }));


                setVideoUrl(receivedVideoUrl);
                showToast.success(
                    "Video Generation Started",
                    "Your video is being processed. Check back soon or enable email notifications."
                );

                if (emailNotify) {
                    await sendEmailNotification(receivedVideoUrl);
                }

                // Start countdown simulation (replace with actual status polling if possible)
                setIsWaiting(true);
                setIsLoadingVideo(true); // Keep loading indicator until countdown finishes
                setCountdown(waitTime); // Reset countdown
                const interval = setInterval(() => {
                    setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(interval);
                        setIsWaiting(false);
                        setIsLoadingVideo(false); // Video is "ready"
                        // setVideoUrl(receivedVideoUrl); // Already set
                        showToast.success(
                        "Video Ready",
                        "Your video should be ready for download."
                        );
                        return 0;
                    }
                    return prevCountdown - 1;
                    });
                }, 1000);


            } else {
                 throw new Error("Webhook response successful but missing videoUrl.");
            }
        } else {
             // Handle non-200/202 responses
             throw new Error(`Webhook returned status ${response.status}: ${response.data?.error || 'Unknown error'}`);
        }

      } catch (axiosError: any) {
        console.error("Axios error calling webhook:", axiosError);
        let errorMsg = "Could not initiate video generation. Please try again.";
        if (axiosError.response) {
            errorMsg = `Generation failed: ${axiosError.response.data?.error || axiosError.response.statusText || 'Server error'}`;
        } else if (axiosError.request) {
            errorMsg = "Generation failed: No response received from the server.";
        } else {
            errorMsg = `Generation failed: ${axiosError.message}`;
        }
        showToast.error("Generation Failed", errorMsg);
        setError(errorMsg); // Set error state
         // Mark all steps as error if submission fails
        setProcessingSteps(steps => steps.map(s => ({ ...s, status: 'error' })));
      }

      // This seems misplaced if generation fails above
      // setSuccessMessage("Your video has been generated successfully!");

    } catch (error: any) {
        // Catch errors from validation or pre-checks
        console.error("Error during submit process:", error);
        setError(error.message || "An unexpected error occurred.");
        showToast.error(
            "Submission Failed",
            error instanceof Error ? error.message : "Please try again"
        );
         // Mark all steps as error
        setProcessingSteps(steps => steps.map(s => ({ ...s, status: 'error' })));
    } finally {
      setIsLoading(false); // Ensure loading is always stopped
    }
  };


  const handleCopyLink = () => {
    if (!videoUrl) return;
    navigator.clipboard.writeText(videoUrl);
    showToast.success("Link Copied", "Video link copied to clipboard.");
  }

  const handleVoicePreview = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!voiceAudioRef.current) {
      voiceAudioRef.current = new Audio();
    }

    const voiceUrlTemplate = process.env.NEXT_PUBLIC_VOICE_URL; // Use NEXT_PUBLIC_
    if (!voiceUrlTemplate) {
      showToast.error("Config Error", "Voice preview URL is not configured.");
      return;
    }
    const voiceUrl = voiceUrlTemplate.replace('{value}', voice);


    try {
      if (voiceAudioRef.current.src !== voiceUrl) {
        voiceAudioRef.current.src = voiceUrl;
        setIsPlaying(false); // Reset playing state if source changes
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
      showToast.error("Preview Error", "Failed to play voice preview.");
      setIsPlaying(false); // Reset state on error
    }
  };

  useEffect(() => {
    setShowMusicUrlInput(music === "others");
  }, [music]);

  // Cleanup audio elements on unmount
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

      Keep the narrative flowing naturally without sections or breaks. Focus on vivid details and emotional connections.
      IMPORTANT RULES: The generated story MUST be a single block of text. Do NOT use newline characters (\\n), double quotes ("), single quotes ('), colons (:), hyphens (-), underscores (_), or periods (.). Use only spaces between words.`;

      const response = await generateGeminiResponse(prompt);

      if (response.success && response.text) { // Check if text exists
        setStory(response.text);
        showToast.success(
          "Story Generated",
          `Story created successfully! You have ${remainingLimit} generations remaining this minute.`
        );
      } else {
        showToast.error("Generation Failed", response.error || "Failed to generate story text");
      }
    } catch (error) {
        console.error("Error generating story:", error);
        showToast.error(
            "Generation Failed",
            error instanceof Error ? error.message : "An unexpected error occurred"
        );
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const stepLabels = {
    1: "Story Content",
    2: "Audio Settings",
    3: "Video Settings"
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      // Add validation for current step before proceeding if needed
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Determine if user is eligible for extended length options
  const canUseExtendedLength = subscription?.plan === 'pro' || subscription?.plan === 'elite' || isUnrestricted;


  return (
    <MotionConfig reducedMotion="user">
      {/* Header Section */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="w-full mx-auto mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Video Generation Studio
          </h1>
          <p className="text-blue-100 text-lg max-w-3xl">
            Transform your story into a captivating video. Select your story type, customize audio,
            and choose video settings to create a unique viewing experience.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-300/20">
              <span className="text-xs font-medium text-blue-100">Step-by-Step Process</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-300/20">
              <span className="text-xs font-medium text-blue-100">Multiple Voice Options</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-300/20">
              <span className="text-xs font-medium text-blue-100">Custom Background Music</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Divider with Instructions */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="w-full mx-auto mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Getting Started
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Follow the steps below to generate your video. Start by selecting a story type and entering your story text,
              then customize the audio settings, and finally configure your video preferences.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Form Content */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="w-full mx-auto space-y-8 p-6 sm:p-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl relative"
      >
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {Object.entries(stepLabels).map(([step, label]) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    parseInt(step) <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700'
                  }`}
                >
                  {parseInt(step)}
                </div>
                <div className="hidden sm:block ml-3 text-sm font-medium">
                  {label}
                </div>
                {step !== "3" && (
                  <div className="hidden sm:block w-16 md:w-24 h-1 mx-2 md:mx-4 bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px] relative" // Ensure consistent height during transitions
          >
            {/* --- Step 1: Story Content --- */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <SectionHeader title="Create Your Story" description="Select a genre and provide the text for your video."/>
                <div className="flex items-center justify-end"> {/* Moved button here */}
                  <Button
                    onClick={generateStoryPrompt}
                    variant="outline"
                    className="group"
                    disabled={isGeneratingStory}
                  >
                    <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    {isGeneratingStory ? "Generating..." : "Generate Story"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {storyTypes.map((type) => (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedStoryType === type ? "default" : "outline"}
                        onClick={() => setSelectedStoryType(type)}
                        className="w-full h-full min-h-[60px] rounded-lg text-center" // Ensure text wraps
                      >
                        {type}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="relative">
                  <Label htmlFor="story-textarea" className="sr-only">Story Content</Label>
                  <Textarea
                    id="story-textarea"
                    placeholder="Enter your story here, or click 'Generate Story' above..."
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    maxLength={MAX_CHARACTERS}
                    className="min-h-[200px] w-full p-4 rounded-lg border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {validationErrors.story && <p className="text-red-500 text-xs mt-1">{validationErrors.story}</p>}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-4 bottom-4 text-sm text-gray-500"
                  >
                    {story.length} / {MAX_CHARACTERS}
                  </motion.div>
                </div>
              </div>
            )}

            {/* --- Step 2: Audio Settings --- */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <SectionHeader
                  title="Audio Settings"
                  description="Customize the background music and voice for your video."
                />

                <div className="grid grid-cols-1 gap-8">
                  {/* Background Music Section */}
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Background Music
                    </h3>
                    <div className="flex items-center space-x-4">
                      <Label htmlFor="music-select" className="sr-only">Background Music</Label>
                      <select
                        id="music-select"
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={music}
                        onChange={(e) => setMusic(e.target.value)}
                      >
                        {musicOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleMusicPreview}
                              className="flex-shrink-0"
                              aria-label="Preview Music"
                            >
                              {isMounted && isAudioPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M11 7H8V17H11V7Z M13 17H16V7H13V17Z" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z" /></svg>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview Music</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {showMusicUrlInput && (
                      <div className="mt-4">
                        <Label htmlFor="music-url">Custom Music URL</Label>
                        <Input
                          id="music-url"
                          type="url"
                          placeholder="https://example.com/music.mp3"
                          value={musicUrl}
                          onChange={(e) => setMusicUrl(e.target.value)}
                          className="mt-1"
                        />
                         {validationErrors.musicUrl && <p className="text-red-500 text-xs mt-1">{validationErrors.musicUrl}</p>}
                        <p className="text-sm text-gray-500 mt-1">
                          Enter a public URL to your music file (e.g., MP3).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Voice Selection Section */}
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Voice Selection
                    </h3>
                    <div className="flex items-center space-x-4">
                       <Label htmlFor="voice-select" className="sr-only">Voice</Label>
                      <select
                        id="voice-select"
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                      >
                        {voiceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleVoicePreview}
                              className="flex-shrink-0"
                              aria-label="Preview Voice"
                            >
                              {isMounted && isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M11 7H8V17H11V7Z M13 17H16V7H13V17Z" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8 5v14l11-7z" /></svg>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview Voice</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- Step 3: Video Settings --- */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <SectionHeader
                  title="Video Settings"
                  description="Configure the orientation, Video length, and notification preferences."
                />

                {/* Video Orientation */}
                 <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                   <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                     Video Orientation
                   </h3>
                   <VideoScaleOptions value={videoScale} onChange={setVideoScale} />
                 </div>


                {/* Video Length Section - Always visible, options disabled if needed */}
                {/* Removed the outer {canUseExtendedLength && ( */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Video Length
                      Video Length
                    </h3>
                    {/* Show different description based on eligibility */}
                    {!canUseExtendedLength ? (
                      <p className="text-sm text-orange-500 dark:text-orange-400 mb-4">
                        Extended video length options are available on Pro and Elite plans. <a href="/pricing" className="underline hover:text-orange-600">Upgrade now</a>.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-4">Longer videos consume more usage credits.</p>
                    )}
                    {/* Disable options if user cannot use extended length, but allow selection if they are eligible */}
                    <RadioGroup value={videoLength} onValueChange={setVideoLength} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {/* Default is always enabled */}
                        <RadioGroupItem value="default" id="len-default" />
                        <Label htmlFor="len-default">Shot (~2 mins) - 1 Credit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                         {/* Disable medium/long if not eligible */}
                        <RadioGroupItem value="medium" id="len-medium" disabled={!canUseExtendedLength} />
                        <Label htmlFor="len-medium" className={!canUseExtendedLength ? 'text-muted-foreground cursor-not-allowed opacity-50' : ''}>Medium (2-5 mins) - 2 Credits</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="long" id="len-long" disabled={!canUseExtendedLength} />
                        <Label htmlFor="len-long" className={!canUseExtendedLength ? 'text-muted-foreground cursor-not-allowed opacity-50' : ''}>Long (5+ mins) - 3 Credits</Label>
                      </div>
                    </RadioGroup>
                  </div>
                {/* Removed the closing )} */}

                 {/* Email Notification */}
                 <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                   <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                     Notifications
                   </h3>
                   <div className="flex items-center space-x-2">
                     <Checkbox
                       id="emailNotify"
                       checked={emailNotify}
                       onCheckedChange={(checked) => setEmailNotify(checked as boolean)}
                     />
                     <Label htmlFor="emailNotify" className="text-sm font-normal"> {/* Use font-normal */}
                       Notify me by email when the video is ready
                     </Label>
                   </div>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t dark:border-gray-700">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1 || isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <AnimatedButton
              type="submit"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Generating..."
              disabled={isLoading || isWaiting || story.length > MAX_CHARACTERS || !story.trim()}
              className="px-8"
            >
              Generate Video
            </AnimatedButton>
          ) : (
            <Button onClick={goToNextStep} disabled={isLoading}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Processing/Result Sections */}
        <AnimatePresence>
          {isLoading && !isWaiting && ( // Show progress bar only during initial API call phase
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 mt-8"
            >
              <ProgressBar
                value={progress}
                showValue
                color="bg-blue-500"
              />
               <p className="text-center text-sm text-muted-foreground">Initiating video generation...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isWaiting && ( // Show countdown/waiting indicator
             <motion.div
                variants={containerStagger}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4 mt-8 text-center"
             >
                <h3 className="text-xl font-semibold">Processing Your Video...</h3>
                <p className="text-muted-foreground">This may take several minutes. Feel free to enable email notifications.</p>
                <CountdownTimer
                  duration={waitTime} // Use state variable for duration
                  onComplete={() => { /* Handled by interval now */ }}
                />
                 <div className="flex justify-center items-center space-x-2 mt-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Please wait...</span>
                 </div>
             </motion.div>
          )}
          {isVideoReady && videoUrl && ( // Show video only when ready and URL exists
            <motion.div
              variants={scale}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 mt-8"
            >
              <SuccessCheckmark />
              <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">Your Video is Ready!</h2>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-lg">
                 <video controls className="w-full h-full object-cover">
                   <source src={videoUrl} type="video/mp4" />
                   Your browser does not support the video tag.
                 </video>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button asChild className="flex-1">
                  <a target="_blank" href={videoUrl} download rel="noopener noreferrer">
                    Download Video
                  </a>
                </Button>
                <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                  Copy Link
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

         {/* Display General Error - Pass the error state directly */}
         {error && !isLoading && (
             <ErrorAlert error={error} />
         )}

      </motion.div>

       {/* Login Modal - Add missing dummy props */}
       <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            setIsSignupModalOpen={() => {}} // Add dummy prop
            onLoginSuccess={() => { // Add dummy prop
                setShowLoginModal(false);
                // Optionally re-fetch subscription here if needed after login
                if (user?.uid) {
                    getUserSubscription(user.uid).then(setSubscription);
                }
            }}
        />

    </MotionConfig>
  );
}

// Helper function (remains the same)
function getStoryTypeDescription(type: string): string {
  const descriptions = {
    "African Folktales": "Traditional stories passed down through generations, rich in culture and wisdom",
    "History": "Historical events and figures brought to life through compelling visuals",
    "News": "Current events transformed into engaging video content",
    "Bedtime Stories": "Soothing tales perfect for children's entertainment and education"
  };
  return descriptions[type as keyof typeof descriptions] || "";
}
