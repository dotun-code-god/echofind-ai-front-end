import { Store } from "pullstate";
import type { TAudio } from "../types/audio";
import { createRef } from "react";

export type PlaybackMark = {
    id: string;
    name: string;
    timeStamp: number;
};

type InitialAudioState = {
    selectedAudio: TAudio | null;
    audios: TAudio[];
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    playbackRate: number;
    isLoading: boolean;
};

export const AudioStore = new Store<InitialAudioState>({
    selectedAudio: null,
    audios: [],
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    volume: 60,
    isMuted: false,
    playbackRate: 1,
    isLoading: false,
});

export const setIsPlaying = (isPlaying: boolean) => {
    AudioStore.update(s => {
        s.isPlaying = isPlaying;
    });
};

export const setCurrentTime = (time: number) => {
    AudioStore.update(s => {
        s.currentTime = time;
    });
};

export const setDuration = (duration: number) => {
    AudioStore.update(s => {
        s.duration = duration;
    });
};

export const setVolume = (volume: number) => {
    AudioStore.update(s => {
        s.volume = volume;
    });
};

export const setIsMuted = (isMuted: boolean) => {
    AudioStore.update(s => {
        s.isMuted = isMuted;
    });
};

export const setPlaybackRate = (rate: number) => {
    AudioStore.update(s => {
        s.playbackRate = rate;
    });
};

export const setIsLoading = (isLoading: boolean) => {
    AudioStore.update(s => {
        s.isLoading = isLoading;
    });
};

export const addPlaybackMark = (mark: PlaybackMark) => {
    AudioStore.update(s => {
        s.selectedAudio?.playBackMarks?.push(mark);
    });
};


export const removePlaybackMark = (id: string) => {
    AudioStore.update(s => {
        s.selectedAudio!.playBackMarks = s.selectedAudio!.playBackMarks?.filter(mark => mark.id !== id);
    });
};

export const clearPlaybackMarks = () => {
    AudioStore.update(s => {
        s.selectedAudio!.playBackMarks = [];
    });
};

export const jumpToTime = (time: number) => {
    AudioStore.update(s => {
        s.currentTime = Math.max(0, Math.min(time, s.duration));
    });
};

export const skipForward = (seconds: number = 15) => {
    AudioStore.update(s => {
        s.currentTime = Math.min(s.currentTime + seconds, s.duration);
    });
};

export const skipBackward = (seconds: number = 15) => {
    AudioStore.update(s => {
        s.currentTime = Math.max(s.currentTime - seconds, 0);
    });
};

export const togglePlayPause = () => {
    AudioStore.update(s => {
        s.isPlaying = !s.isPlaying;
    });
};

export const setPlaybackMarks = (marks: PlaybackMark[]) => {
    AudioStore.update(s => {
        s.selectedAudio!.playBackMarks = marks;
    });
}

export const useAudio = () => {
    // Shared refs for DOM elements so different components access the same nodes
    // MutableRefObject is used here to provide a stable object across imports.
    // They are module-level singletons defined below and returned to callers.
    const data = AudioStore.useState();
    return {...data, audioRef: sharedAudioRef, progressBarRef: sharedProgressBarRef};
};


// Module-level shared refs so every component gets the same ref object
export const sharedAudioRef = createRef<HTMLAudioElement>();
export const sharedProgressBarRef = createRef<HTMLInputElement>();

