import { FiMaximize2, FiPause, FiPlay, FiSkipBack, FiSkipForward, FiVideo, FiVolume2 } from "react-icons/fi";
import { Button } from "../../ui/button";
import { motion } from "motion/react"
import { Slider } from "../../ui/slider";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "../../stores/audio";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

interface MediaPlayerProps {
  currentTime: number;
  onTimeUpdate?: (time: number) => void;
}


const MediaPlayer = ({currentTime, onTimeUpdate} : MediaPlayerProps) => {
    const {selectedAudio} = useAudio();

    if(!selectedAudio){
        return <></>;
    }

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(70);
    const [duration] = useState(945); // 15:45 in seconds

    useEffect(() => {
        // Update progress based on currentTime prop
        if (currentTime > 0) {
        setProgress((currentTime / duration) * 100);
        setIsPlaying(true);
        }
    }, [currentTime, duration]);

    useEffect(() => {
        if (isPlaying) {
        const interval = setInterval(() => {
            setProgress(prev => {
            const newProgress = prev + (100 / duration);
            if (newProgress >= 100) {
                setIsPlaying(false);
                return 100;
            }
            return newProgress;
            });
        }, 1000);

        return () => clearInterval(interval);
        }
    }, [isPlaying, duration]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentSeconds = Math.floor((progress / 100) * duration);

    const audioElement = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if(audioElement.current){
            if(isPlaying){
                audioElement.current.play();
            }else{
                audioElement.current.pause();
            }
        }
    }, [isPlaying]);

    const onUpdateCurrentTime = (value: number[]) => {
        const newProgress = value[0];
        console.log({newProgress});
        setProgress(newProgress);
        const newTime = newProgress * duration;
        if(audioElement.current){
            audioElement.current.currentTime = newTime;
        }
        
        if(onTimeUpdate){
            onTimeUpdate(newTime);
        }
    }
    
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 w-[calc(100%_-_288px)] right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
            {/* <audio 
                ref={audioElement}
                src={selectedAudio?.filePath} 
                controls
                // onTimeUpdate={}
            >
            </audio> */}

                <AudioPlayer />
            
                {/* Progress Bar */}
                <div className="mb-4">
                    <Slider
                        value={[progress]}
                        onValueChange={onUpdateCurrentTime}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{formatTime(currentSeconds)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    {/* Left: File Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiVideo className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm">{selectedAudio?.fileName}</p>
                            <p className="text-xs text-gray-500">Now Playing</p>
                        </div>
                    </div>

                    {/* Center: Playback Controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const newProgress = Math.max(0, progress - 5);
                                setProgress(newProgress);
                            }}
                        >
                            <FiSkipBack className="w-5 h-5" />
                        </Button>

                        <Button
                            size="lg"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 rounded-full custom-gradient text-white"
                        >
                        {isPlaying ? (
                            <FiPause className="w-6 h-6" fill="currentColor" />
                        ) : (
                            <FiPlay className="w-6 h-6 ml-0.5" fill="currentColor" />
                        )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const newProgress = Math.min(100, progress + 5);
                                setProgress(newProgress);
                            }}
                        >
                            <FiSkipForward className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Right: Volume & Extra Controls */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <div className="flex items-center gap-2 min-w-0 max-w-32">
                            <FiVolume2 className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <Slider
                                value={[volume]}
                                onValueChange={(value) => setVolume(value[0])}
                                max={100}
                                className="w-full"
                            />
                        </div>
                        <Button variant="ghost" size="sm">
                            <FiMaximize2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
    
}

export default MediaPlayer;