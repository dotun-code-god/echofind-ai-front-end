import { useEffect, useState } from "react";
import { BsPlus, BsTrash, BsPlayFill } from "react-icons/bs";
import { jumpToTime, setIsPlaying, setPlaybackMarks, useAudio } from "../../stores/audio";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePlaybackMark, fetchPlaybackMarks, savePlaybackMark } from "../../actions/audio";
import { BeatLoader } from "react-spinners";

const PlaybackMarks = () => {
    const { selectedAudio, currentTime, duration } = useAudio();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMarkLabel, setNewMarkLabel] = useState("");
    const [newMarkTime, setNewMarkTime] = useState<number>(0);
    const {playBackMarks} = selectedAudio!;

    const {data: fetchBookmarks, isLoading, refetch} = useQuery({
        queryKey: ["playback-marks"],
        queryFn: () => fetchPlaybackMarks(selectedAudio?.id || 0),
        refetchOnWindowFocus: false,
        enabled: !!selectedAudio?.id,
    });

    useEffect(() => {
        if(selectedAudio?.id && fetchBookmarks){
            refetch();
            setPlaybackMarks(fetchBookmarks.data);
        }
    }, [selectedAudio?.id, fetchBookmarks?.data]);

    const savePlayback = useMutation({
        mutationFn: savePlaybackMark,
        mutationKey: ['save-playback-mark'],
    })
    
    const removePlayback = useMutation({
        mutationFn: deletePlaybackMark,
        mutationKey: ['remove-playback-mark'],
    })
    
    useEffect(() => {
        if (showAddForm) setNewMarkTime(Math.floor(currentTime));
    }, [showAddForm, currentTime]);

    const handleAddMark = () => {
        if (newMarkLabel.trim()) {
            savePlayback.mutate({
                audioId: selectedAudio?.id || 0,
                mark: {
                    name: newMarkLabel.trim(),
                    timeStamp: Math.max(0, Math.min(newMarkTime || 0, duration || 0)),
                }
            })
            setNewMarkLabel("");
            setNewMarkTime(0);
            setShowAddForm(false);
        }
    };

    const handleJumpToMark = (time: number) => {
        jumpToTime(time);
        setIsPlaying(true);
    };

    const handleRemoveMark = (id: string) => {
        removePlayback.mutate({markId: id});
    };

    const formatTime = (seconds: number): string => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-3">
            {
                isLoading ? (
                    <div className="flex items-center">
                        <p className="text-sm text-gray-500 animate-pulse">Loading bookmarks</p>
                        <BeatLoader size={6} />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {playBackMarks && playBackMarks.length > 0 && (
                            <div className="flex gap-2 max-w-md overflow-x-auto">
                                {playBackMarks?.map((mark) => (
                                    <div 
                                        key={mark.id}
                                        className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                                    >
                                        <button
                                            onClick={() => handleJumpToMark(mark.timeStamp)}
                                            className="flex items-center gap-1 hover:opacity-80"
                                            title={`Jump to ${mark.name}`}
                                        >
                                            <BsPlayFill size={14} />
                                            <span>{mark.name}</span>
                                            <span className="text-blue-200">({formatTime(mark.timeStamp)})</span>
                                        </button>
                                        <button
                                            onClick={() => handleRemoveMark(mark.id)}
                                            className="hover:text-red-300"
                                            title="Remove mark"
                                        >
                                            <BsTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {showAddForm ? (
                            <div className="flex items-center gap-2 bg-white border rounded p-2 shadow-sm">
                                <input
                                    type="text"
                                    value={newMarkLabel}
                                    onChange={(e) => setNewMarkLabel(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddMark();
                                        if (e.key === 'Escape') {
                                            setShowAddForm(false);
                                            setNewMarkLabel("");
                                        }
                                    }}
                                    placeholder="Title (e.g. Chorus, Intro)"
                                    className="bg-gray-50 text-gray-900 px-2 py-1 rounded text-sm outline-none w-40"
                                    autoFocus
                                />

                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <label className="text-xs">Time</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={duration || 0}
                                        value={newMarkTime}
                                        onChange={(e) => setNewMarkTime(Number(e.target.value))}
                                        className="w-20 bg-gray-50 text-gray-900 px-2 py-1 rounded text-sm outline-none"
                                        title="Time in seconds"
                                    />
                                    <span className="text-xs text-gray-400">{formatTime(newMarkTime)}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setNewMarkTime(Math.max(0, newMarkTime - 5))}
                                        className="text-sm px-2 py-1 bg-gray-100 rounded"
                                        title="Back 5s"
                                    >-5s</button>
                                    <button
                                        onClick={() => setNewMarkTime(Math.min(duration || 0, newMarkTime + 5))}
                                        className="text-sm px-2 py-1 bg-gray-100 rounded"
                                        title="Forward 5s"
                                    >+5s</button>
                                </div>

                                <button
                                    onClick={handleAddMark}
                                    className="text-white bg-blue-600 px-3 py-1 rounded text-sm"
                                    disabled={!newMarkLabel.trim()}
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewMarkLabel("");
                                    }}
                                    className="text-sm text-gray-500 px-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-1 custom-gradient text-white px-3 py-1 rounded text-sm transition-colors"
                                title="Add bookmark at current time"
                                disabled={duration === 0}
                            >
                                <BsPlus size={14} />
                                <span>Add mark</span>
                            </button>
                        )}
                    </div>
                )
            }
        </div>
    );
};

export default PlaybackMarks;
