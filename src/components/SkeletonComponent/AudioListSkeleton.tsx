const AudioListSkeleton = () => {

    return (
        <div className={`relative animate-pulse mt-4`}>
            <div className={`w-full relative grid gap-3 px-2`}>
                {Array(4).fill(null).map((_,i) => 
                    <li key={i} className="w-full h-10 cursor-pointer bg-[#303030] p-[0.45rem] px-3 rounded-xl flex items-center gap-3" />
                )}
            </div>
        </div>
    )
    
}

export default AudioListSkeleton;