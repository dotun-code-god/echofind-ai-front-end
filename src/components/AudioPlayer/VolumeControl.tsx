import { useEffect } from "react";
import { IoMdVolumeOff, IoMdVolumeLow, IoMdVolumeHigh } from "react-icons/io";
import { setVolume, setIsMuted, useAudio } from "../../stores/audio";
import { Slider } from "../../ui/slider";

const VolumeControl = () => {
    const { audioRef, volume, isMuted } = useAudio();

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const onSliderChange = (values: number[]) => {
        const newVolume = Math.round(values[0] || 0);
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) setIsMuted(false);
    };

    useEffect(() => {
        if (audioRef?.current) {
            audioRef.current.volume = (volume ?? 0) / 100;
            audioRef.current.muted = !!isMuted;
        }
    }, [volume, audioRef, isMuted]);

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
                {isMuted || volume < 5 ? (
                    <IoMdVolumeOff size={20} />
                ) : volume < 40 ? (
                    <IoMdVolumeLow size={20} />
                ) : (
                    <IoMdVolumeHigh size={20} />
                )}
            </button>

            <div className="flex items-center gap-3 w-48">
                <Slider
                    value={[volume]}
                    onValueChange={onSliderChange}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                />
                <div className="text-xs text-gray-500 w-10 text-right">
                    {isMuted ? "M" : `${volume}%`}
                </div>
            </div>
        </div>
    );
};

export default VolumeControl;