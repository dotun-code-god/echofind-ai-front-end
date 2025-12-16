import { BsBookmark } from "react-icons/bs";
import { addPlaybackMark } from "../stores/audio";
import JumpToTime from "./AudioPlayer/JumpToTime";

interface TranscriptSegment {
    id: string;
    text: string;
    startTime: number;
    endTime: number;
    speaker?: string;
}

interface TranscriptWithJumpProps {
    segments: TranscriptSegment[];
}

/**
 * Example component showing how to integrate jump-to-time functionality
 * with transcript segments. This can be used in your TranscriptView component.
 */
const TranscriptWithJump = ({ segments }: TranscriptWithJumpProps) => {
    const formatTime = (seconds: number): string => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddBookmark = (segment: TranscriptSegment) => {
        addPlaybackMark({
            id: `segment-${segment.id}`,
            name: segment.text.substring(0, 30) + (segment.text.length > 30 ? '...' : ''),
            timeStamp: segment.startTime,
        });
    };

    return (
        <div className="space-y-4 p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Transcript</h3>
            {segments.map((segment) => (
                <div 
                    key={segment.id}
                    className="flex gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                    <div className="flex flex-col gap-1 min-w-[80px]">
                        <JumpToTime 
                            time={segment.startTime}
                            label={formatTime(segment.startTime)}
                            className="text-xs font-mono"
                        />
                        {segment.speaker && (
                            <span className="text-xs text-gray-500">{segment.speaker}</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-300">{segment.text}</p>
                    </div>
                    <button
                        onClick={() => handleAddBookmark(segment)}
                        className="text-gray-500 hover:text-blue-400 transition-colors"
                        title="Bookmark this segment"
                    >
                        <BsBookmark size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TranscriptWithJump;
