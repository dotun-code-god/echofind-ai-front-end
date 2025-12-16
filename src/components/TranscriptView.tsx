import {motion} from "motion/react"
import { Button } from "../ui/button";
import { FiDownload, FiPlay, FiSearch, FiStar, FiX } from "react-icons/fi";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { AudioStore, jumpToTime, setIsPlaying, useAudio } from "../stores/audio";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTranscriptSegments } from "../actions/transcript-segment";
import { highlightText } from "../utils/highlight-text";
import TranscriptViewSkeleton from "./SkeletonComponent/TranscriptViewSkeleton";

const TranscriptView = ({
    onClose,
} : {
    onClose: () => void;
}) => {
    const {selectedAudio} = useAudio();
    const [searchQuery, setSearchQuery] = useState("");

    
    const fetchTranscriptSegmentsQuery = useQuery({
        queryKey: ["fetch-transcript-segments", selectedAudio?.transcript?.id],
        enabled: !!selectedAudio?.id,
        queryFn: fetchTranscriptSegments,
        refetchOnWindowFocus: false,
        refetchOnMount() {
            return Boolean(selectedAudio?.transcript?.segments && (selectedAudio?.transcript?.segments.length === 0));
        },
    })

    useEffect(() => {
        if(fetchTranscriptSegmentsQuery.data && selectedAudio){
            AudioStore.update(s => {
                if(s.selectedAudio){
                    s.selectedAudio = {
                        ...s.selectedAudio,
                        transcript: {
                            ...s.selectedAudio.transcript!,
                            segments: fetchTranscriptSegmentsQuery.data!
                        }
                    }
                }
            })
        }
    }, [fetchTranscriptSegmentsQuery.data])
        
    const filteredTranscript = useMemo(() => {
        const segments = fetchTranscriptSegmentsQuery.data || [];

        if (searchQuery.length > 2) {
            return segments.filter(segment => 
                segment.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return segments;
    }, [searchQuery, fetchTranscriptSegmentsQuery.data]);

    const handleJumpToTime = (time: number) => {
        jumpToTime(time);
        setIsPlaying(true);
    }
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] mb-32 flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl mb-1">Full Transcript</h2>
                            <p className="text-sm text-gray-600">{selectedAudio?.fileName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <FiDownload className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <FiX className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search in transcript..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {
                    fetchTranscriptSegmentsQuery.isLoading ? (
                        <TranscriptViewSkeleton />
                    ) : (
                        <>
                            {/* Transcript Content */}
                            <ScrollArea className="flex-1 p-6 h-[calc(100vh-48px)] overflow-auto">
                                <div className="space-y-4">
                                    {filteredTranscript.map((segment, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="flex gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors"
                                        >
                                            <div className="flex-shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleJumpToTime(Number(segment.startTime))}
                                                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                >
                                                    <FiPlay className="w-3 h-3 mr-1" />
                                                    {segment.startTime}
                                                </Button>
                                            </div>
                                            <p className="flex-1 text-gray-700 leading-relaxed">
                                                {highlightText(segment.text, searchQuery)}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {filteredTranscript.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </>
                    )
                }

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <p className="text-sm text-gray-600 text-center">
                        {filteredTranscript.length} segments • Generated by AI transcription
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default TranscriptView;