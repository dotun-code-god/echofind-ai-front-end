import React, { useEffect, useRef, useState } from 'react'
import { AudioStore } from '../stores/audio';
import { transcribeAudio, uploadAudio } from '../actions/audio';
import { useNavigate } from 'react-router';

const Upload = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [audioFile, setAudioFile] = React.useState<File | null>(null);
    const [currentScreen, setCurrentScreen] = useState<"initial" | "uploading" | "transcribing" | "result">("initial"); 
    const [uploadingFile, setUplodingFile] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const navigate = useNavigate();

    const ALLOWED_EXTS = ['wav','mp3','m4a','mp4','webm','ogg','flac','aac','opus','mov'];
    const MAX_FILE_BYTES = 3 * 1024 * 1024 * 1024; // 3 GB hard limit
    const ASSUMED_BITRATE_BPS = 192000; // 192 kbps assumed for estimating duration

    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // validation
            const allowedExts = ['wav','mp3','m4a','mp4','webm','ogg','flac','aac','opus','mov'];
            const name = file.name || '';
            const ext = name.split('.').pop()?.toLowerCase() || '';

            const MAX_FILE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB hard limit
            const ASSUMED_BITRATE_BPS = 192000; // 192 kbps assumed for estimating duration

            if (!allowedExts.includes(ext)){
                setValidationError(`Invalid file type. Allowed: ${allowedExts.join(', ')}`);
                setAudioFile(null);
                return;
            }

            if (file.size > MAX_FILE_BYTES){
                setValidationError(`File too large. Maximum allowed is ${convertBytesToReadableSize(MAX_FILE_BYTES)}.`);
                setAudioFile(null);
                return;
            }

            // estimate duration in seconds using assumed bitrate
            const estimatedSeconds = (file.size * 8) / ASSUMED_BITRATE_BPS;
            const estimatedHours = estimatedSeconds / 3600;
            if (estimatedHours > 8){
                setValidationError(`Estimated duration is ${estimatedHours.toFixed(1)} hrs which exceeds the 8 hour limit. Try a shorter file or lower-bitrate source.`);
                setAudioFile(null);
                return;
            }

            // passed validation
            setValidationError(null);
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

    const estimateHoursFromSize = (bytes: number) => {
        const seconds = (bytes * 8) / ASSUMED_BITRATE_BPS;
        return seconds / 3600;
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }, [audioFile]);

    const upload = async() => {
        if (!audioFile) return;

        if (validationError) {
            alert(validationError);
            return;
        }

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
            <input ref={inputRef} onChange={handleFileUpload} type="file" accept=".wav,.mp3,.m4a,.mp4,.webm,.ogg,.flac,.aac,.opus" className="mb-4 hidden" />
            {
                currentScreen === "initial" && 
                <button onClick={() => inputRef.current?.click()} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition">
                    Upload
                </button>
            }

            {validationError && (
                <div className="mt-4 p-3 bg-red-700 text-red-100 rounded">{validationError}</div>
            )}

            <div className="mt-2 text-sm text-gray-200">
                Supported: {ALLOWED_EXTS.join(', ')} — Max duration: 6 hours. Max file size: {convertBytesToReadableSize(MAX_FILE_BYTES)}.
            </div>

            {currentScreen === "uploading" && audioFile && (
                <div className="border border-gray-700 p-4 rounded-lg mt-4 relative bg-gray-800">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-200" onClick={() => setAudioFile(null)}>
                        &times;
                    </button>
                    <h3 className="text-lg font-semibold">Uploaded File:</h3>
                    <p className="text-sm">{audioFile.name}</p>
                    <p className="text-sm">Size: {convertBytesToReadableSize(audioFile.size)}</p>
                    <p className="text-sm">Estimated duration (approx): {estimateHoursFromSize(audioFile.size).toFixed(2)} hrs</p>
                    {validationError && (
                        <div className="mt-2 p-2 bg-red-700 text-red-100 rounded">{validationError}</div>
                    )}
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