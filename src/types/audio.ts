import type { TTranscript } from "../actions/audio";
import type { SummaryLanguage } from "../components/SummaryView";
import type { PlaybackMark } from "../stores/audio";

export enum AudioUploadStatus {
    UPLOADING = "UPLOADING",
    UPLOAD_COMPLETE = "UPLOAD_COMPLETE",
    TRANSCRIBING = "TRANSCRIBING",
    TRANSCRIPT_COMPLETE = "TRANSCRIPT_COMPLETE"
}

export type _TAudioSummary = {
    id: string;
    summary: string;
    keyTopics: {title: string; description: string}[];
    // keyInsights: string[];
    // tags: string[];
    language: SummaryLanguage;
    // audio: TAudio
}

export type TAudio = {
    id: number;
    fileName: string;
    fileType: string;
    filePath: string;
    fileSize: number;

    gcsFilePath: string;
    duration: number;

    status: AudioUploadStatus;
    
    createdAt: string;
    updatedAt: string;
    summary: _TAudioSummary[];
    transcript: TTranscript | null;

    playBackMarks?: PlaybackMark[];
}