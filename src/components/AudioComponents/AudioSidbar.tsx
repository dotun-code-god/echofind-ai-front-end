import { IoMusicalNotes } from "react-icons/io5";
import type { TAudio } from "../../types/audio";
import { AudioStore, useAudio } from "../../stores/audio";
import { useNavigate, useParams } from "react-router";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteAudio } from "../../actions/audio";


const AudioSidebar = ({
    audio
} : {
    audio: TAudio
}) => {
    const navigate = useNavigate();
    const [showThreeDots, setShowThreeDots] = useState(false);
    const [showRowOperations, setShowRowOperations] = useState(false);
    const {audios, selectedAudio} = useAudio();
    const { id } = useParams();

    const deleteAudioMut = useMutation({
        mutationKey: ['delete-audio', audio.id],
        mutationFn: deleteAudio,
        onSuccess: () => {
            AudioStore.update(s => {
                s.audios = audios.filter(aud => aud.id != audio.id);
                s.selectedAudio = null;
            })
            
            if(audio.id == selectedAudio?.id){
                navigate('/upload');
            }
        }
    })

    const rowOperations = [
        {
            id: 1,
            label: "Delete",
            icon: <></>,
            isLoading: deleteAudioMut.isPending,
            action: () => {
                deleteAudioMut.mutate({audioId: String(audio.id)});
                setShowRowOperations(false);
            }
        }
    ]
    
    return (
        <li 
            key={audio.id} 
            className={`text-sm cursor-pointer ${(audio?.id+"" == id) ? "bg-[#303030]" : ""} hover:bg-[#303030] flex justify-between items-center p-[0.45rem] px-3 rounded-xl`} 
            onMouseOver={() => setShowThreeDots(true)}
            onMouseOut={() => setShowThreeDots(false)}
            title={audio.fileName}
        >
            <div
                onClick={() => {
                    AudioStore.update(s => {
                        s.selectedAudio = audio
                    })

                    navigate(`/audio/${audio.id}`);
                }}
                className="flex items-center gap-3 overflow-hidden w-52"
            >
                <div>
                    <IoMusicalNotes size={18} />
                </div>
                <span className="truncate">
                    {audio.fileName}
                </span>
            </div>

            {
                showThreeDots && (
                    <div className="relative">
                        <button onClick={() => setShowRowOperations(!showRowOperations)}><BsThreeDots size={16} /></button>
                        {
                            showRowOperations && (
                                <ul className="absolute bg-[#353535] p-1.5 rounded-xl w-56">
                                    {
                                        rowOperations.map(row => (
                                            <li 
                                                key={row.id} 
                                                className="hover:bg-[#4a4a4a] p-[0.45rem] rounded-xl"
                                                onClick={row.action}
                                            >
                                                {row.label}
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </div>
                )
            }
        </li>
    )
}

export default AudioSidebar;