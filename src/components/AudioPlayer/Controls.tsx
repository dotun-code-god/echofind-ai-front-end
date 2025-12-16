import { useEffect, useRef } from "react";
import { 
    setIsPlaying, 
    setCurrentTime, 
    setDuration,
    setIsLoading,
    skipForward as skipForwardAction,
    skipBackward as skipBackwardAction,
    togglePlayPause,
    setPlaybackRate,
    useAudio 
} from "../../stores/audio";
import { MdSpeed } from "react-icons/md";
import { FiPause, FiPlay, FiSkipBack, FiSkipForward } from "react-icons/fi";
import { Button } from "../../ui/button";

const Controls = () => {
    const { selectedAudio, audioRef, progressBarRef, isPlaying, currentTime, duration, playbackRate, isLoading } = useAudio();
    const animationRef = useRef<number | null>(null);

    // Start the rAF update loop (updates store currentTime only)
    const startAnimation = () => {
        const audio = audioRef.current;
        if (!audio || duration <= 0) return;

        const loop = () => {
            const a = audioRef.current;
            if (a && duration > 0) {
                const t = a.currentTime;
                setCurrentTime(t);
            }
            // continue only while audio is playing
            if (a && !a.paused && !a.ended) {
                animationRef.current = requestAnimationFrame(loop);
            } else {
                animationRef.current = null;
            }
        };

        // cancel any previous
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(loop);
    };

    const stopAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    // Handle play/pause commands from UI and ensure animation starts after play resolves
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || isLoading) return;

        if (isPlaying) {
            // ask audio to play, then start animation
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // audio is now playing; start smooth animation
                        startAnimation();
                    })
                    .catch((error) => {
                        console.error("Playback failed:", error);
                        setIsPlaying(false);
                    });
            } else {
                // if browser returned undefined, still attempt to start animation
                startAnimation();
            }
        } else {
            // pause and stop animation
            if (!audio.paused) audio.pause();
            stopAnimation();
            // update time in store one last time
            if (audio && duration > 0) {
                setCurrentTime(audio.currentTime);
            }
        }

        return () => stopAnimation();
    }, [isPlaying, audioRef, isLoading, duration]);
    
    // Sync current time from store to audio element (for skip/jump operations)
    useEffect(() => {
        const audio = audioRef.current;
        if (audio && duration > 0) {
            const timeDiff = Math.abs(audio.currentTime - currentTime);
            // Only update if there's a significant difference (avoids feedback loop from timeupdate)
            if (timeDiff > 1) {
                audio.currentTime = currentTime;
            }
        }
    }, [currentTime, audioRef, duration]);

    const onLoadedMetadata = () => {
        const seconds = audioRef.current?.duration;
        if (seconds !== undefined && !isNaN(seconds)) {
            setDuration(seconds);
            if (progressBarRef.current) {
                progressBarRef.current.max = seconds.toString();
            }
            setIsLoading(false);
        }
    };

    const onCanPlay = () => {
        setIsLoading(false);
    };

    const onWaiting = () => {
        setIsLoading(true);
    };

    const onEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleSkipForward = () => {
        skipForwardAction(15);
    };

    const handleSkipBackward = () => {
        skipBackwardAction(15);
    };

    const cyclePlaybackRate = () => {
        const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = rates.indexOf(playbackRate);
        const nextRate = rates[(currentIndex + 1) % rates.length];
        setPlaybackRate(nextRate);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextRate;
        }
    };
    
    return (
        <div className="flex gap-4 items-center">
            <audio 
                ref={audioRef}
                src={selectedAudio?.filePath}
                onLoadedMetadata={onLoadedMetadata}
                onCanPlay={onCanPlay}
                onWaiting={onWaiting}
                onEnded={onEnded}
                preload="metadata"
            />

            <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipBackward}
                disabled={isLoading}
                className="hover:scale-110 transition-transform"
                title="Skip backward 15s"
            >
                <FiSkipBack className="w-5 h-5" />
            </Button>

            <Button
                size="lg"
                onClick={togglePlayPause}
                title={isPlaying ? "Pause" : "Play"}
                disabled={isLoading || !selectedAudio}
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
                onClick={handleSkipForward}
                disabled={isLoading}
                className="hover:scale-110 transition-transform"
                title="Skip forward 15s"
            >
                <FiSkipForward className="w-5 h-5" />
            </Button>
            
            <button 
                onClick={cyclePlaybackRate}
                className="hover:scale-110 transition-transform flex items-center gap-1 text-sm"
                disabled={isLoading}
                title="Playback speed"
            >
                <MdSpeed size={20} />
                <span>{playbackRate}x</span>
            </button>
        </div>
    );
};

export default Controls;