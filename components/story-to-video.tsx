"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
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

const MAX_CHARACTERS = 1000
const storyTypes = ["African Folktales", "History", "News", "Bedtime Stories"]
const defaultStoryType = "African Folktales"
let audio: HTMLAudioElement; // Declare audio variable
let voiceAudio: HTMLAudioElement; // Declare voice audio variable

export default function StoryToVideo() {

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const [isMounted, setIsMounted] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [story, setStory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [waitTime, setWaitTime] = useState(300) // 5 minutes in seconds
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState("");
  const [music, setMusic] = useState("1");
  const [musicUrl, setMusicUrl] = useState("");
  const [voice, setVoice] = useState("en-US-Andrew");
  const { toast } = useToast();
  const [showMusicUrlInput, setShowMusicUrlInput] = useState(false);
  const [apiMusicUrls, setApiMusicUrls] = useState({}); // State to store music URLs from API

  useEffect(() => {
    audio = new Audio(); // Initialize audio here, on client side only
    voiceAudio = new Audio(); // Initialize voice audio here, on client side only
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

  useEffect(() => {
    let currentMusicUrl: string = "";
    let playUrl;
    if (music === "others") {
      currentMusicUrl = musicUrl ?? "";
    } else {
      currentMusicUrl = apiMusicUrls[music as keyof typeof apiMusicUrls] ?? "";
    }
    audio.src = currentMusicUrl;
  }, [music, musicUrl, apiMusicUrls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (story.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a story before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setProgress(0)

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

      setVideoUrl(response.data.videoUrl)
      toast({
        title: "Success",
        description: "Your video has been generated successfully!",
      })

      // Start the timer
      setIsWaiting(true);
      setIsLoadingVideo(true);
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(interval);
            setIsWaiting(false);
            setIsLoadingVideo(false);
            setVideoUrl(response.data.videoUrl); // Load the video URL
            toast({
              title: "Download Ready",
              description: "Your video is ready for download.",
            });
            return 0;
          }
          return prevCountdown - 1;
        });
        setWaitTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsWaiting(false);
            setIsLoadingVideo(false);
            setVideoUrl(response.data.videoUrl); // Load the video URL
            toast({
              title: "Download Ready",
              description: "Your video is ready for download.",
            });
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while generating your video with music. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl)
    toast({
      title: "Copied!",
      description: "Video link copied to clipboard.",
    })
  }

  const [isPlaying, setIsPlaying] = useState(false);

  const handleVoicePlayPause = () => {
    const voiceUrl = process.env.NEXT_PUBLIC_VOICE_URL?.replace('{value}', voice);
    if (!voiceUrl) {
      toast({
        title: "Error",
        description: "Voice URL is not defined in the environment variables.",
        variant: "destructive",
      });
      return;
    }
    voiceAudio.src = voiceUrl;

    if (voiceUrl) {
      try {
        new URL(voiceUrl);
        if (isPlaying) {
          voiceAudio.pause();
          setIsPlaying(false);
        } else {
          voiceAudio.play().then(() => {
            setIsPlaying(true);
          }).catch((error: Error) => {
            if (error.name === 'AbortError') {
              voiceAudio.load(); // Reload the audio source
              voiceAudio.play().then(() => {
                setIsPlaying(true);
              }).catch((error: Error) => {
                if (error.name === 'AbortError') {
                  console.error('The play() request was interrupted by a new load request.');
                } else {
                  console.error('Error playing audio:', error);
                }
              });
            } else {
              console.error('Error playing audio:', error);
            }
          });
        }
      } catch (e) {
        console.error("Error creating URL:", e);
        toast({
          title: "Error",
          description: "Invalid voice URL.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "No voice URL available for this option.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    setShowMusicUrlInput(music === "others");
  }, [music]);

  const [selectedStoryType, setSelectedStoryType] = useState(defaultStoryType);

  return (
    <div id="StoryToVideo" className="w-full mx-auto space-y-8 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Story Time</h1>
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">Story Type:</span>
        {storyTypes.map((type) => (
          <Button
            key={type}
            variant={selectedStoryType === type ? "default" : "outline"}
            onClick={() => setSelectedStoryType(type)}
            style={{ borderRadius: '30px' }}
            className="md:mr-2"
          >
            {type}
          </Button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter a summary message for the video to be generated..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            maxLength={MAX_CHARACTERS}
            className="h-60 text-gray-900 dark:text-white"
          />
          <div className="flex justify-between text-sm text-muted-foreground dark:text-gray-400">
            <span>
              {story.length} / {MAX_CHARACTERS}
            </span>
            {story.length > MAX_CHARACTERS && <span className="text-destructive">Character limit exceeded</span>}
            {story.length === 0 && !story && <span className="text-destructive">Summary message is required</span>}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="music" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Background Sound
          </label>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <select
              id="music"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
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
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => {
                      let playUrl;
                      if (music === "others") {
                        playUrl = musicUrl || "";
                      } else {
                        playUrl = apiMusicUrls[music as keyof typeof apiMusicUrls] || "";
                      }

                      if (playUrl) {
                        try {
                          new URL(playUrl);
                          if (audio.paused) {
                            audio.play();
                          } else {
                            audio.pause();
                          }
                        } catch (e) {
                          console.error("Error creating URL:", e);
                          toast({
                            title: "Error",
                            description: "Invalid music URL.",
                            variant: "destructive",
                          });
                        }
                      } else {
                        toast({
                          title: "Error",
                          description: "No music URL available for this option.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    {isMounted && !audio.paused ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M11 7H8V17H11V7Z" /> <path d="M13 17H16V7H13V17Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
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
        </div>
        {showMusicUrlInput && (
          <div className="space-y-2">
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
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="voice" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Voice
          </label>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <select
              id="voice"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
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
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={handleVoicePlayPause}
                  >
                    {isMounted && isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M11 7H8V17H11V7Z" /> <path d="M13 17H16V7H13V17Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
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
        </div>
        <Button type="submit" disabled={isLoading || isWaiting || story.length > MAX_CHARACTERS} className="">
          {isLoading ? "Generating..." : isWaiting ? "Please wait..." : "Generate Video"}
        </Button>
      </form>
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full text-gray-900 dark:text-white" />
          <p className="text-center text-sm text-muted-foreground dark:text-gray-400">{progress}% complete</p>
        </div>
      )}
      {isWaiting && (
        <div className="space-y-2">
          <p className="text-center text-sm text-muted-foreground dark:text-gray-400">Please wait for 5 minutes as the video is being generated.</p>
          <div id="countdown" className="text-center text-4xl font-bold mt-4 text-gray-900 dark:text-white">{formatTime(countdown)}</div>
        </div>
      )}
      {videoUrl && (
        <div className="space-y-4">
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
        </div>
      )}
      <Toaster />
    </div>
  );
}
