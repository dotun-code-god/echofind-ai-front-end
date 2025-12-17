import React, { useEffect, useRef, useState } from 'react'
import { AudioStore } from '../stores/audio';
import { transcribeAudio, uploadAudio } from '../actions/audio';
import { useNavigate } from 'react-router';

const Upload = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [audioFile, setAudioFile] = React.useState<File | null>(null);
    const [currentScreen, setCurrentScreen] = useState<"initial" | "uploading" | "transcribing" | "result">("initial"); 
    const [uploadingFile, setUplodingFile] = useState(false);
    const navigate = useNavigate();

    
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

    const upload = async() => {
        if (!audioFile) return;

        try{
            setUplodingFile(true);
            
            const fd = new FormData();
            fd.append('file', audioFile);
            
            const response = await uploadAudio(fd);

            console.log({response});

            if(response.success){
                setCurrentScreen("transcribing");
                AudioStore.update(s => {
                    s.selectedAudio = response.data;
                })

                // send the audio for transcribing
                const audio = response.data;
                await transcribeAudio({audioUrl: audio.gcsFilePath});
                
                navigate(`/audio/${audio.id}`);
            }

        }catch(error){
            console.log({error});
            alert("An error occurred during upload. Please try again.");
            setCurrentScreen("initial");
            setAudioFile(null);
        }finally{
            setUplodingFile(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen flex-col bg-gradient-to-br from-blue-700 via-purple-800 to-fuchsia-700 text-white">
            <h2 className="text-2xl font-bold mb-4">Upload Your Audio/Video File</h2>
            <input ref={inputRef} onChange={handleFileUpload} type="file" accept="audio/*" className="mb-4 hidden" />
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
                    <button 
                        onClick={upload} 
                        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition disabled:opacity-50"
                        disabled={uploadingFile}
                    >
                        {uploadingFile ? "Uploading..." : "Start Upload and Transcribe"}
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

export default Upload;