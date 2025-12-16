import { motion } from "motion/react";
import { IoSparkles } from "react-icons/io5";
import { Button } from "../ui/button";
import { FiClock, FiTag, FiTrendingUp, FiX } from "react-icons/fi";
import { useAudio } from "../stores/audio";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateAudioKeyTopics, generateAudioSummary } from "../actions/audio";
import { useEffect, useRef, useState } from "react";
import SummaryViewSkeleton from "./SkeletonComponent/SummaryViewSkeleton";
import { Select, SelectItem, SelectTrigger, SelectContent } from "../ui/select";
import KeyTopicsSkeleton from "./SkeletonComponent/KeyTopicsSkeleton";
import type { _TAudioSummary } from "../types/audio";

export type SummaryLanguage = "english" | "hausa" | "yoruba" | "igbo";

const SummaryView = ({onClose}: {onClose: () => void}) => {
    const {selectedAudio} = useAudio();
    const [summary, setSummary] = useState<_TAudioSummary>({
        id: "",
        summary: "",
        keyTopics: [],
        language: "english",
    });

    const [language, setLanguage] = useState<SummaryLanguage>("english");
    const langRef = useRef(language);

    const generateSummary = useQuery({
        queryFn: () => generateAudioSummary(selectedAudio?.id || 0, language as SummaryLanguage),
        queryKey: ['generate-audio-summary', language],
        refetchOnWindowFocus: false,
        enabled: !!selectedAudio?.id,
        refetchOnMount() {
            return selectedAudio?.summary?.length == 0;
        }
    })

    const generateKeyTopics = useMutation({
        mutationFn: () => generateAudioKeyTopics(selectedAudio?.id || 0, language as SummaryLanguage, summary.id),
        mutationKey: ['generate-audio-keytopics'],
    })

    useEffect(() => {
        if (generateSummary.data) {
            console.log("Summary data:", generateSummary.data);
            const returned = generateSummary.data.data;
            setSummary((prev) => ({ ...prev, summary: returned.summary, id: returned.id, language: returned.language }));
            langRef.current = returned.language;
        }
    }, [generateSummary.data]);

    const handleLanguageChange = (lang: SummaryLanguage) => {
        setLanguage(lang);
        generateSummary.refetch();
    }

    useEffect(() => {
        const fetchKeyTopics = async() => {
            try{
                const keyTopicsRes = await generateKeyTopics.mutateAsync();
                const kt = keyTopicsRes.data;
                console.log({kt});
                if( kt ) {
                    setSummary((prev) => ({ ...prev, keyTopics: kt }));
                }
            }catch(error){
                console.error("generateKeyTopics failed:", error);
            }
        }

        if((summary.summary && !generateKeyTopics.isPending && summary.keyTopics.length === 0) || (langRef.current !== language && summary.summary)) {
            fetchKeyTopics();
        }
    }, [summary.summary, language]);
    
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <IoSparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl mb-1">AI Summary</h2>
                            <p className="text-sm text-gray-600">{selectedAudio?.fileName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={language}
                            onValueChange={(value) => handleLanguageChange(value as SummaryLanguage)}
                        >
                            <SelectTrigger size="sm" className="px-3 py-1.5">
                                {language}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="hausa">Hausa</SelectItem>
                                <SelectItem value="yoruba">Yoruba</SelectItem>
                                <SelectItem value="igbo">Igbo</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <FiX className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {
                generateSummary.isLoading ? (
                    <SummaryViewSkeleton />
                ) : !summary.summary ? (
                    <div>
                        <p className="text-gray-500 p-6 text-center">No summary available.</p>
                    </div>
                ) : (
                    <ScrollArea className="flex-1 p-6 h-[calc(100vh-48px)] overflow-auto">
                        <div className="space-y-6">
                            {/* summary */}
                            <div>
                            <div className="flex items-center gap-2 mb-3">
                                <FiTrendingUp className="w-5 h-5 text-purple-600" />
                                <h3>summary</h3>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                                <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: summary.summary.replace(/\n/g, "<br/>") }}></p>
                            </div>
                            </div>

                            {/* Key Topics */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FiClock className="w-5 h-5 text-blue-600" />
                                    <h3>Key Topics Discussed</h3>
                                </div>
                                {
                                    generateKeyTopics.isPending ? (
                                        <KeyTopicsSkeleton />
                                    ) : (
                                        <div className="space-y-3">
                                            {summary.keyTopics.map((topic, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="text-lg">{topic.title}</h4>
                                                        {/* <Badge variant="secondary" className="text-xs">
                                                            {topic.timestamp}
                                                        </Badge> */}
                                                    </div>
                                                    <p className="text-sm text-gray-600">{topic.description}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </ScrollArea>
                )
            }

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <p className="text-sm text-gray-600 text-center">
                Generated by AI • Powered by N-ATLaS 
            </p>
            </div>
        </motion.div>
        </motion.div>
    );
}

export default SummaryView;