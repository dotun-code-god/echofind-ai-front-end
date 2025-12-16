import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { BsFillBookmarksFill } from "react-icons/bs";
import { FiSearch, FiUpload } from "react-icons/fi";
import { loadUserAudios } from "../actions/audio";
import AudioListSkeleton from "../components/SkeletonComponent/AudioListSkeleton";
import { useNavigate } from "react-router";
import AudioSidebar from "../components/AudioComponents/AudioSidbar";
import { AudioStore, useAudio } from "../stores/audio";

const Sidebar = () => {

    const navigate = useNavigate();
    const {audios: myAudios} = useAudio();
    
    const fetchAudios = useQuery({
        queryFn: loadUserAudios,
        queryKey: ["fetch-user-audios"]
    })

    useEffect(() => {
        if(fetchAudios.data){
            AudioStore.update(s => {
                s.audios = fetchAudios.data!.data;
            })
        }
    }, [fetchAudios.data])
    
    return (
        <div className="w-72 text-white bg-[#13131A]">
            <h1 className="font-semibold text-xl p-5">EchoFind AI</h1>

            <ul className="grid px-2">
                <li 
                    className="cursor-pointer hover:bg-[#20202F] p-[0.45rem] px-3 rounded-xl flex items-center gap-3"
                    onClick={() => navigate("/upload")}
                >
                    <FiUpload size={18} />
                    Upload Audio
                </li> 
                <li className="cursor-pointer hover:bg-[#20202F] p-[0.45rem] px-3 rounded-xl flex items-center gap-3">
                    <FiSearch size={18} />
                    Search Audio
                </li> 
                <li className="cursor-pointer hover:bg-[#20202F] p-[0.45rem] px-3 rounded-xl flex items-center gap-3">
                    <BsFillBookmarksFill size={18} />
                    Saved Bookmarks
                </li> 
            </ul>

            <div>
                <h1 className="text-[#afafaf] text-sm p-5 pb-0">Your Audios</h1>

                {
                    fetchAudios.isLoading ? (
                        <AudioListSkeleton />
                    ) : myAudios?.length > 0 ? (
                        <div className="mt-2 px-2">
                            { myAudios?.map((audio) => <AudioSidebar audio={audio} />) }
                        </div>
                    ) : (
                        <div className="text-sm text-center mt-5">
                            There are no audio found.
                        </div>
                    )
                }
            </div>
        </div>
    )
    
}

export default Sidebar;