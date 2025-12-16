import React, { useEffect, useRef, useState } from 'react'

enum Model {
    unavailable = "unavailable",
    downloadable = "downloadable",
    downloading = "downloading",
    available = "available"
}

type PromptAPIImageType = ImageBitmapSource | VideoFrame | OffscreenCanvas | HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | BufferSource;
type PromptAPIAudioType = AudioBuffer | Blob | BufferSource;

interface LanguageModelOptions {
    temperature?: number;
    topK?: number;
    initialPrompts?: Array<{
        role: "system" | "user" | "assistant";
        content: string;
    }>;
    expectedInputs?: Array<{
        type: "text";
        content?: string;
        languages?: string[];
    } | {
        type: "image";
        content?: PromptAPIImageType;
        languages?: string[];
    } | {
        type: "audio";
        content?: PromptAPIAudioType;
    }>;
    expectedOutputs?: Array<{
        type: "text";
        languages?: string[];
    } >;
    signal?: AbortSignal;
    monitor?: (session: any) => void;
}

interface LanguageModel {
    availability: () => Promise<Model>;
    create: (options: LanguageModelOptions) => Promise<ModelSession>;
    params: () => any;
}

type ModelSessionDataContent = string | Array<{
    type: "text"; value: string
} | {
    type: "image"; value: PromptAPIImageType
} | {
    type: "audio"; value: PromptAPIAudioType
}>;

type ModelSessionData = string | Array<{
    role: "user"; 
    content: ModelSessionDataContent;
} | {
    role: "assistant"; 
    content: ModelSessionDataContent;
    prefix?: boolean;
}>;

interface PromptAPIJSONSchema {
    type: "object" | "array" | "string" | "number" | "integer" | "boolean" | "null";
    properties?: {
        [key: string]: PromptAPIJSONSchema;
    };
    items?: PromptAPIJSONSchema | PromptAPIJSONSchema[];
    required?: string[];
    enum?: any[];
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    additionalProperties?: boolean;
}

type ModelSessionOptions = {
    responseConstraint?: PromptAPIJSONSchema | RegExp;
    omitResponseConstraint?: boolean;
    signal?: AbortSignal;
}

interface ModelSession {
    addEventListener: (event: string, callback: (e: any) => void) => void;
    prompt: (data: ModelSessionData, options?: ModelSessionOptions) => Promise<any>;
    promptStream: (options: ModelSessionData) => Promise<any>;
    clone: () => ModelSession;
    append: (data: ModelSessionData) => void;
    measureInputUsage: (data: ModelSessionData) => { inputTokens: number; inputCharacters: number; };
}

const UploadComponent = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [audioFile, setAudioFile] = React.useState<File | null>(null);
    const [currentScreen, setCurrentScreen] = useState<"initial" | "uploading" | "transcribing" | "result">("initial"); 
    
    const [modelState, setModelState] = useState<Model>(Model.unavailable);
    
    // useEffect(() => {
    //     // Only add the meta tag if the token exists and hasn't been added yet
    //     const token = import.meta.env.VITE_ORIGIN_TRIAL_TOKEN;
    //     if (token && !document.querySelector('meta[http-equiv="origin-trial"]')) {
    //         const otMeta = document.createElement('meta');
    //         otMeta.httpEquiv = 'origin-trial';
    //         otMeta.content = token;
    //         document.head.appendChild(otMeta);
    //     }
    // }, []);
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAudioFile(file);
            setCurrentScreen("uploading");
        }
    }

    const convertBytesToReadableSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }, [audioFile]);

    const handleTranscribe = async() => {
        if (!audioFile) return;

        try{
            if("LanguageModel" in window){
                const LanguageModel : LanguageModel = (window as any).LanguageModel;
                const modelAvailability = await LanguageModel.availability();
                if(modelAvailability === Model.unavailable){
                    // here we can give users appropriate feedback and going forwards use cloud models
                    alert("Model is unavailable. Please try again later.");
                    return;
                }
                if(modelAvailability === Model.downloading){
                    setModelState(Model.downloading);
                    alert("Model is downloading. Please wait and try again.");
                    return;
                }
                if(modelAvailability === Model.downloadable || modelAvailability === Model.available){
                    setModelState(Model.available);

                    console.log("Model is available. Starting transcription...");
                    
                    setCurrentScreen("transcribing");

                    // create a session
                    const params = await LanguageModel.params();
                    const session : ModelSession = await LanguageModel.create({
                        temperature: 0.1,
                        topK: params.defaultTopK,
                        monitor(m) {
                            m.addEventListener("downloadprogress", (e:any) => {
                                console.log(`Downloaded ${e.loaded * 100}%`);
                            });
                        },
                        initialPrompts: [{
                            role: "system",
                            content: "You are an AI assistant that accurately transcribes audio files into text. Focus on capturing every word, including filler words, and ensure the transcription reflects the speaker's tone and intent. Do not add any additional information or context beyond what is present in the audio."
                        }],
                        expectedInputs: [{type: "audio"}],
                        expectedOutputs: [{type: "text", languages: ["en"]}],
                    })

                    console.log({session});
                    
                    const response = await session.prompt([
                        {
                            role: "user",
                            content: [
                                {type: "text", value: "Transcribe the following audio file to text:"},
                                {type: "audio", value: audioFile}
                            ]
                        }
                    ]);
                    console.log("Transcription Result: ", response);
                    alert("Transcription completed! Check console for result.");
                    setCurrentScreen("result");

                    // so am thinking of saving it to the indexedDB from here and then redirecting to a new page where we can show the results and also have a search bar to search within the transcription, 
                    // such that even when i scale to allow users to upload multiple files, 
                    // and maybe search through their fields, it will be easy to manage in that we just reference that transcription in the indexedDB and preload the page with that data and search through it
                    // also we can have a history page where users can see their past transcriptions
                } else {
                    alert("Model is in an unknown state. Please try again later.");
                }
            }
        }catch(error){
            console.log({error});
            alert("An error occurred during transcription. Please try again.");
            setCurrentScreen("initial");
            setAudioFile(null);
            setModelState(Model.unavailable);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen flex-col bg-gradient-to-b from-blue-900 to-black text-white">
            <h2 className="text-2xl font-bold mb-4">Upload Your Audio/Video File</h2>
            <input ref={inputRef} onChange={handleFileUpload} type="file" accept="audio/*,video/*" className="mb-4 hidden" />
            {
                currentScreen === "initial" && 
                <button onClick={() => inputRef.current?.click()} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition">
                    Upload
                </button>
            }

            {currentScreen === "uploading" && audioFile && (
                <div className="border border-gray-700 p-4 rounded-lg mt-4 relative bg-gray-800">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-200" onClick={() => setAudioFile(null)}>
                        &times;
                    </button>
                    <h3 className="text-lg font-semibold">Uploaded File:</h3>
                    <p className="text-sm">{audioFile.name}</p>
                    <p className="text-sm">Size: {convertBytesToReadableSize(audioFile.size)}</p>
                    <button disabled={modelState === Model.available} onClick={handleTranscribe} className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
                        Transcribe
                    </button>
                </div>
            )}

            {currentScreen === "transcribing" && (
                <div className="border border-gray-700 p-4 rounded-lg mt-4 bg-gray-800">
                    
                    <div className="border border-gray-700 p-4 rounded-lg bg-gray-800">
                        <h3 className="text-lg font-semibold">Transcribing...</h3>
                        <div className="h-2 bg-gray-600 rounded-full">
                            {/* Progress bar goes here */}
                        </div>
                    </div>
                    <p className="text-sm">Please wait while we process your file.</p>
                </div>
            )}

            <footer className="absolute bottom-4 text-sm text-gray-400">
                &copy; 2024 EchoFind. All rights reserved.
            </footer>
        </div>
    )
}

export default UploadComponent;