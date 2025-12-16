import { jumpToTime } from "../../stores/audio";

interface JumpToTimeProps {
    time: number;
    label?: string;
    children?: React.ReactNode;
    className?: string;
}

/**
 * Reusable component to jump to a specific time in the audio
 * Useful for transcript segments or chapter navigation
 */
const JumpToTime = ({ time, label, children, className = "" }: JumpToTimeProps) => {
    const handleClick = () => {
        jumpToTime(time);
    };

    const formatTime = (seconds: number): string => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <button
            onClick={handleClick}
            className={`inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors ${className}`}
            title={`Jump to ${label || formatTime(time)}`}
        >
            {children || label || formatTime(time)}
        </button>
    );
};

export default JumpToTime;
