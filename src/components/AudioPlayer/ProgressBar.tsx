import { useEffect, useState } from "react";
import { jumpToTime, useAudio } from "../../stores/audio";
import { BsBookmarkFill } from "react-icons/bs";
import { Slider } from "../../ui/slider";

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ProgressBar = () => {
    const { currentTime, duration, selectedAudio } = useAudio();
    const [isDragging, setIsDragging] = useState(false);
    const [dragValue, setDragValue] = useState(0);
    
    const handleValueChange = (values: number[]) => {
        const newTime = values[0] || 0;
        setDragValue(newTime);
        setIsDragging(true);
    };

    const handleValueCommit = (values: number[]) => {
        const newTime = values[0] || 0;
        setIsDragging(false);
        jumpToTime(newTime);
    };

    // drag handled via Slider's onValueChange/onValueCommit

    const handleMarkClick = (time: number) => {
        jumpToTime(time);
    };

    useEffect(() => {

        console.log({marks: selectedAudio?.playBackMarks})
    }, [selectedAudio?.playBackMarks])
    
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-center gap-5 w-full">
                <span className="text-sm min-w-[45px] text-right">{formatTime(currentTime)}</span>
                <div className="relative flex-1 max-w-[80%]">
                    <Slider
                        value={[isDragging ? dragValue : currentTime]}
                        onValueChange={handleValueChange}
                        onValueCommit={handleValueCommit}
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        className="w-full"
                    />
                    {/* Playback marks */}
                    {selectedAudio?.playBackMarks && selectedAudio?.playBackMarks.length > 0 && selectedAudio.playBackMarks.map((mark) => (
                        <button
                            key={mark.id}
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hover:scale-125 transition-transform"
                            style={{ left: `${(mark.timeStamp / duration) * 100}%` }}
                            onClick={() => handleMarkClick(mark.timeStamp)}
                            title={`${mark.name} - ${formatTime(mark.timeStamp)}`}
                        >
                            <BsBookmarkFill size={12} className="text-blue-500" />
                        </button>
                    ))}
                    {/* Hover tooltip removed (Slider handles visual range) */}
                </div>
                <span className="text-sm min-w-[45px]">{formatTime(duration)}</span>
            </div>
        </div>
    );
};

export default ProgressBar;