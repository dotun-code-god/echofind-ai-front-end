import api from "../config/axios";
import type { ApiResponse } from "../types/api";
import type { TTranscriptSegment } from "./audio";

export const fetchTranscriptSegments = async({ queryKey }: { queryKey: any[] }) => {
    const transcriptId = queryKey[1];
    console.log({transcriptId});
    const {data} = await api.get<ApiResponse<TTranscriptSegment[]>>(`/audio/transcript/${transcriptId}/transcript-segment`);
    return data.data;
}