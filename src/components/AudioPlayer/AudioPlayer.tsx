import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./TrackInfo";
import VolumeControl from "./VolumeControl";
import PlaybackMarks from "./PlaybackMarks";
import { motion } from "motion/react";
import { useAudio } from "../../stores/audio";

const AudioPlayer = () => {

    const {selectedAudio} = useAudio();

    if(!selectedAudio){
        // design a semi backdrop filter to indicate no audio is selected with the same dimensions as the audio player
        return (
            <div className="fixed bottom-0 w-[calc(100%_-_288px)] right-0 bg-white/50 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="h-16 flex items-center justify-center text-gray-500">
                        No audio selected
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 w-[calc(100%_-_288px)] right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                {/* Top: Progress */}
                <div className="mb-4">
                    <ProgressBar />
                </div>

                {/* Main controls row */}
                <div className="flex items-center justify-between">
                    {/* Left: Track Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <TrackInfo />
                    </div>

                    {/* Center: Controls */}
                    <div className="flex items-center gap-4">
                        <Controls />
                    </div>

                    {/* Right: Volume and Marks */}
                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="flex items-center gap-2 text-gray-400">
                            <VolumeControl />
                        </div>
                    </div>
                </div>

                {/* Playback Marks */}
                <div className="border-t border-gray-100 pt-3 mt-3">
                    <PlaybackMarks />
                </div>
            </div>
        </motion.div>
    );
};

export default AudioPlayer;