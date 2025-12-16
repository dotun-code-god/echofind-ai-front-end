import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AudioUploadStatus, type TAudio } from "../types/audio";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAudio, performAudioSearch, transcribeAudio, type TTranscriptSegment } from "../actions/audio";
import { BiPlay, BiSearch } from "react-icons/bi";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";
import { BsClock } from "react-icons/bs";
import { ScrollArea } from "../ui/scroll-area";
import AudioHeader from "../components/Audio/Header";
import { AudioStore, jumpToTime, setIsPlaying } from "../stores/audio";
import TranscriptView from "../components/TranscriptView";
import { highlightText } from "../utils/highlight-text";
import { BarLoader } from "react-spinners";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";
import SummaryView from "../components/SummaryView";
import AskAIView from "../components/AskAIView";

const Audio = () => {
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [showAskAI, setShowAskAI] = useState(false);

    const [audio, setAudio] = useState<TAudio | null>(null);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const [results, setResults] = useState<TTranscriptSegment[]>([]);
    
    const fetchAudioDetails = useQuery({
        queryKey: ["fetch-audio", id],
        queryFn: () => fetchAudio(id!),
        enabled: !!id
    })

    useEffect(() => {
        if(fetchAudioDetails.data?.data && id){
            console.log({id})
            const audioResponse = fetchAudioDetails.data?.data;
            console.log({audioResponse})

            setAudio(audioResponse);
            AudioStore.update(s => {
                s.selectedAudio = {
                    ...audioResponse,
                    playBackMarks: s.selectedAudio?.playBackMarks || []
                };
                s.isPlaying = false;
                s.currentTime = 0;
            })
        }
    }, [fetchAudioDetails.data, id])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.length > 2) {
            setHasSearched(true);
        }
    };

    const handleTranscribe = useMutation({
        mutationFn: transcribeAudio,
        mutationKey: ['transcribe-audio'],
        onSuccess: () => {
            fetchAudioDetails.refetch();
        }
    });

    const searchResults = useMutation({
        mutationKey: ['search-audio'],
        mutationFn: performAudioSearch,
    })

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        const performSearch = async() => {
            if(audio && debouncedSearchQuery.length > 2){
                const response = await searchResults.mutateAsync({
                    query: debouncedSearchQuery,
                    audioId: audio.id
                }); 
                console.log({response});    
                if(response.success){
                    setResults(response.data);
                }
            }else{
                setResults([]);
            }
        }
        performSearch();
    }, [debouncedSearchQuery, audio]);

    const handleJumpToTime = (time: number) => {
        jumpToTime(time);
        setIsPlaying(true);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                {/* Header */}
                <AudioHeader 
                    handleTranscribe={handleTranscribe}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    showTranscript={() => setShowTranscript(true)}
                    showSummary={() => setShowSummary(true)}
                    showAskAI={() => setShowAskAI(true)}
                />

                <BarLoader
                    loading={searchResults.isPending}
                    width={"100%"}
                    className="mb-3 -translate-y-0.5"
                />

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {!hasSearched ? (audio?.status == AudioUploadStatus.TRANSCRIPT_COMPLETE ? 
                        (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <BiSearch className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl mb-3">Ready to Search</h2>
                                <p className="text-gray-600 mb-8">
                                    Type any word or phrase to find it in your media file
                                </p>

                                {/* Quick suggestions */}
                                <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                                    <p className="w-full text-sm text-gray-500 mb-2">Try searching for:</p>
                                    {['machine learning', 'introduction', 'conclusion', 'important', 'summary'].map((term) => (
                                        <Button
                                            key={term}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery(term);
                                                setHasSearched(true);
                                            }}
                                            className="rounded-full"
                                        >
                                            {term}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-40"
                            >
                                <h2 className="text-3xl mb-3">Your audio has been successfully uploaded</h2>
                                <button 
                                    onClick={() => audio ? handleTranscribe.mutate({audioUrl: audio?.gcsFilePath}) : {}}
                                    className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition disabled:opacity-50"
                                    disabled={handleTranscribe.isPending}
                                >
                                    {handleTranscribe.isPending ? "Transcribing" : "Transcribe Audio"}
                                </button>
                            </motion.div>
                        )
                    ) : results.length > 0 ? (
                    <div>
                        {/* Results Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between mb-6"
                        >
                        <div>
                            <h3 className="text-2xl mb-1">Search Results</h3>
                            <p className="text-gray-600">
                            Found <span className="text-purple-600">{results.length}</span> mentions of "{searchQuery}"
                            </p>
                        </div>
                        <Badge variant="secondary" className="px-3 py-1">
                            <BsClock className="w-3 h-3 mr-1" />
                            Total: {audio?.duration}
                        </Badge>
                        </motion.div>

                        {/* Results List */}
                        <ScrollArea className="h-[calc(100vh-300px)]">
                            <div className="space-y-3">
                                {results.map((result, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Timestamp */}
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                    <span className="text-white">{result.startTime}</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="mb-3">
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {highlightText(result.text, searchQuery)}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleJumpToTime(Number(result.startTime))}
                                                        className="custom-gradient text-white"
                                                    >
                                                        <BiPlay className="w-4 h-4 mr-1" />
                                                        Play from here
                                                    </Button>
                                                    <span className="text-xs text-gray-500">
                                                        Jump to {result.startTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <BiSearch className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl mb-2">No results found</h3>
                        <p className="text-gray-600">
                            Try searching for different keywords or phrases
                        </p>
                    </motion.div>
                    )}
                </div>
            </div>
            
            <AudioPlayer />

            {showTranscript && (
                <TranscriptView
                    onClose={() => setShowTranscript(false)}
                />
            )}

            {showSummary && (
                <SummaryView
                    onClose={() => setShowSummary(false)}
                />
            )}

            {showAskAI && (
                <AskAIView
                    onClose={() => setShowAskAI(false)}
                />
            )}
        </>
        
    )
    
}

export default Audio;