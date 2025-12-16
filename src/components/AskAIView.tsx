import {motion} from "motion/react";
import { BiMessageSquare, BiSend } from "react-icons/bi";
import { useAudio } from "../stores/audio";
import { Button } from "../ui/button";
import { FiX } from "react-icons/fi";
import { ScrollArea } from "../ui/scroll-area";
import { IoSparkles } from "react-icons/io5";
import { BsClock } from "react-icons/bs";
import { useState } from "react";
import { Input } from "../ui/input";

interface Message {
  type: 'user' | 'ai';
  text: string;
  timestamp?: string;
}


const AskAIView = ({onClose}: {onClose: () => void}) => {
    const {selectedAudio} = useAudio();
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'ai',
            text: "Hi! I'm your AI Audio assistant. Ask me anything about the content of your media file. For example, you can ask 'Where does the speaker mention machine learning?' or 'What are the main topics discussed?'"
        }
    ]);
    
    const getMockResponse = (question: string): Message => {
        const lowerQ = question.toLowerCase();
    
        if (lowerQ.includes('machine learning')) {
          return {
            type: 'ai',
            text: "Machine learning is mentioned multiple times throughout the presentation. The main discussion starts at 0:32 where it's introduced as a subset of AI. At 2:34, the speaker discusses how ML algorithms are transforming data processing. At 5:12, there's a mention of ML helping understand complex patterns. Would you like to jump to any of these timestamps?",
            timestamp: "0:32, 2:34, 5:12"
          };
        }
        
        if (lowerQ.includes('healthcare') || lowerQ.includes('medical')) {
          return {
            type: 'ai',
            text: "Healthcare applications are discussed at 8:45, where the speaker talks about using machine learning for early disease detection through image analysis and predictive modeling. This is presented as one of the most promising applications of ML in the medical field.",
            timestamp: "8:45"
          };
        }
        
        if (lowerQ.includes('ethics') || lowerQ.includes('ethical')) {
          return {
            type: 'ai',
            text: "Ethical considerations are addressed starting at 10:15. The speaker discusses important concerns including bias in algorithms, privacy issues, and the impact on employment. They emphasize that 'with great power comes great responsibility' and stress the importance of careful consideration of these issues.",
            timestamp: "10:15"
          };
        }
        
        if (lowerQ.includes('main topic') || lowerQ.includes('about') || lowerQ.includes('summary')) {
          return {
            type: 'ai',
            text: "This presentation is about artificial intelligence and machine learning. It covers: 1) Fundamentals of ML and its types (supervised, unsupervised, reinforcement), 2) Deep learning and neural networks, 3) Real-world applications in healthcare and finance, 4) Ethical considerations, and 5) Future outlook with quantum computing."
          };
        }
        
        if (lowerQ.includes('data') || lowerQ.includes('quality')) {
          return {
            type: 'ai',
            text: "Data quality is discussed at 13:22, where the speaker emphasizes that 'garbage in, garbage out' is especially true for machine learning systems. They stress that data quality is crucial for the success of ML models.",
            timestamp: "13:22"
          };
        }
        
        return {
          type: 'ai',
          text: "I found some relevant information in the transcript. The speaker discusses this topic around the middle section of the presentation. Would you like me to search for something more specific?"
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: question }]);

        // Simulate AI thinking and response
        setTimeout(() => {
        const response = getMockResponse(question);
        setMessages(prev => [...prev, response]);
        }, 1000);

        setQuestion("");
    };
    
    const suggestedQuestions = [
        "Where does the speaker mention machine learning?",
        "What are the healthcare applications discussed?",
        "What ethical concerns are addressed?",
        "What is the main topic of this presentation?"
    ];
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
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <BiMessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl mb-1">Ask AI</h2>
                        <p className="text-sm text-gray-600">{selectedAudio?.fileName}</p>
                    </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <FiX className="w-5 h-5" />
                    </Button>
                </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            {message.type === 'ai' && (
                                <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <IoSparkles className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs text-gray-500">AI Assistant</span>
                                </div>
                            )}
                            
                            <div
                                className={`rounded-2xl p-4 ${
                                message.type === 'user'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                <p className="text-sm leading-relaxed">{message.text}</p>
                                
                                {/* {message.timestamp && onPlayFromTimestamp && (
                                    <div className="mt-3 pt-3 border-t border-gray-300">
                                        <div className="flex items-center gap-2 text-xs">
                                        <BsClock className="w-3 h-3" />
                                        <span>Timestamps: {message.timestamp}</span>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Suggested Questions */}
                {messages.length === 1 && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                    >
                    <p className="text-sm text-gray-500 mb-3">Suggested questions:</p>
                    <div className="space-y-2">
                        {suggestedQuestions.map((q, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-3 px-4"
                            onClick={() => {
                                setQuestion(q);
                                setTimeout(() => handleSubmit(new Event('submit') as any), 100);
                            }}
                        >
                            <BiMessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{q}</span>
                        </Button>
                        ))}
                    </div>
                    </motion.div>
                )}
                </ScrollArea>

                {/* Input */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Ask a question about the content..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="flex-1 bg-white"
                        />
                        <Button
                            type="submit"
                            disabled={!question.trim()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            <BiSend className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        AI responses are generated based on the transcribed content
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default AskAIView;