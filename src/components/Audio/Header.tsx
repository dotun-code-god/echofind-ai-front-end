import { BiSearch } from "react-icons/bi";
import { Input } from "../../ui/input";
import { AudioUploadStatus } from "../../types/audio";
import { Button } from "../../ui/button";
import { FiFileText, FiMessageSquare } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useAudio } from "../../stores/audio";

const AudioHeader = ({
    searchQuery,
    setSearchQuery,
    handleTranscribe,
    handleSearch,
    showTranscript,
    showSummary,
    showAskAI
} : {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    handleTranscribe: any;
    handleSearch: (e: FormEvent) => void;
    showTranscript: () => void;
    showSummary: () => void;
    showAskAI: () => void;
}) => {

    const {selectedAudio} = useAudio();

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <BiSearch className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm text-gray-600">Now searching:</h2>
                            <p className="truncate max-w-xs">{selectedAudio?.fileName}</p>
                        </div>
                    </div>

                    {
                        selectedAudio?.status == AudioUploadStatus.TRANSCRIPT_COMPLETE ? (
                            <div className="flex gap-2">
                                <Button variant="outline" className="border border-black" size="sm" onClick={showTranscript}>
                                    <FiFileText className="w-4 h-4 mr-2" />
                                    Transcript
                                </Button>
                                <Button variant="outline" size="sm" onClick={showSummary}>
                                    <IoSparkles className="w-4 h-4 mr-2" />
                                    Summary
                                </Button>
                                <Button variant="outline" size="sm" onClick={showAskAI}>
                                    <FiMessageSquare className="w-4 h-4 mr-2" />
                                    Ask AI
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <button 
                                    onClick={handleTranscribe}
                                    className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition disabled:opacity-50"
                                    // disabled={uploadingFile}
                                >
                                    Transcribe Audio
                                </button>
                            </div>
                        )
                    }
                </div>

                {/* Search Bar */}
                {
                    selectedAudio?.status == AudioUploadStatus.TRANSCRIPT_COMPLETE && (
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search for words or phrases..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 rounded-xl bg-white border-gray-300 shadow-sm"
                            />
                            </div>
                        </form>
                    )
                }
            </div>
        </header>
    )
}

export default AudioHeader;