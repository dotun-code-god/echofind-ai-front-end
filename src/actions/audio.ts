import type { SummaryLanguage } from "../components/SummaryView";
import api from "../config/axios"
import type { User } from "../context/AuthContext";
import { addPlaybackMark, AudioStore, removePlaybackMark, setPlaybackMarks, type PlaybackMark } from "../stores/audio";
import type { ApiResponse } from "../types/api";
import type { _TAudioSummary, TAudio } from "../types/audio";

type TWordsList = {
    word: string;
    start_offset: string;
    end_offset: string;
    confidence: string;
}

export type TTranscript = {
    id: number;
    user: User;
    transcript: string;
    transcriptionEngine: string;
    wordsList: TWordsList[];
    confidence: number;
    segments: TTranscriptSegment[];
}

export type TTranscriptSegment = {
    id: number;
    startTime: string;
    endTime: string;
    text: string;
    confidence: string;
}

export type _AudioSummarykeyTopics = {
    title: string;
    description: string;
    // timestamp: string;
}

export const loadUserAudios = async() => {
    const {data} = await api.get<ApiResponse<TAudio[]>>('/audio');
    return data;
}

export const uploadAudio = async(fd: FormData) => {
    const {data} = await api.post<ApiResponse<TAudio>>('/upload', 
        fd,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        },
    );

    if(data.success){
        AudioStore.update(store => {
            store.audios.push(data.data);
            store.selectedAudio = data.data;
        })
    }

    return data;
}

export const transcribeAudio = async(payload: {audioUrl: string}) => {
    const {data} = await api.post('/transcribe', {audioUrl: payload.audioUrl});
    return data;
}

export const fetchAudio = async(id: string) => {
    const {data} = await api.get<ApiResponse<TAudio>>(`/audio/${id}`);
    return data;
}

export const deleteAudio = async(payload: {audioId: string}) => {
    const {data} = await api.delete(`/audio/${payload.audioId}`);
    return data;
}

export const performAudioSearch = async (payload: {query: string, audioId: number}) => {
    const {data} = await api.post<ApiResponse<any>>(`/audio/${payload.audioId}/search`, {
        text: payload.query,
        transcriptId: AudioStore.getRawState().selectedAudio?.transcript?.id
    });
    return data;
}

export const fetchPlaybackMarks = async (audioId: number) => {
    if(!audioId) return;
     
    const {data} = await api.get<ApiResponse<PlaybackMark[]>>(`/audio/${audioId}/bookmarks`);
    setPlaybackMarks(data.data);
    return data;
}

export const savePlaybackMark = async (params: {audioId: number, mark: Omit<PlaybackMark, "id">}) => {
    const {data} = await api.post<ApiResponse<PlaybackMark>>(`/audio/${params.audioId}/bookmark`, params.mark);
    addPlaybackMark(data.data);
    return data;
}

export const deletePlaybackMark = async (params: {markId: string}) => {
    const {data} = await api.delete<ApiResponse<null>>(`/audio/bookmark/${params.markId}`);
    removePlaybackMark(params.markId);
    return data;
}

export const generateAudioSummary = async (audioId: number, language: SummaryLanguage) => {
    const {data} = await api.post<ApiResponse<_TAudioSummary>>(`/audio/${audioId}/summary`, {language});
    return data;
}

export const generateAudioKeyTopics = async (audioId: number, language: SummaryLanguage, summaryId: string) => {
    const {data} = await api.post<ApiResponse<_AudioSummarykeyTopics[]>>(`/audio/${audioId}/key-topics`, {language, summaryId});
    return data;
}