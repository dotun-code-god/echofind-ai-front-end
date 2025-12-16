import { useAudio } from "../../stores/audio";
import { BsMusicNoteBeamed } from "react-icons/bs";

const TrackInfo = () => {
    const { selectedAudio, isLoading } = useAudio();

    if (!selectedAudio) {
        return (
            <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                    <BsMusicNoteBeamed size={24} className="text-gray-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-500">No audio selected</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <BsMusicNoteBeamed size={24} color="white" />
            </div>
            <div className="flex flex-col max-w-[200px]">
                <span className="text-sm font-semibold truncate" title={selectedAudio.fileName}>
                    {selectedAudio.fileName}
                </span>
                <span className="text-xs text-gray-400">
                    {isLoading ? "Loading..." : selectedAudio.fileType}
                </span>
            </div>
        </div>
    );
};

export default TrackInfo;