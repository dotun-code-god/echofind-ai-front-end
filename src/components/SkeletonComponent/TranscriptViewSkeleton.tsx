const TranscriptViewSkeleton = () => {

    return (
        <div className={`relative animate-pulse mt-4`}>
            <div className={`w-full px-4 py-3 rounded-lg`}> 
                <div className="h-6 w-40 bg-gray-300 rounded-md mb-4" />

                <div className="space-y-3">
                    {Array(4).fill(null).map((_, i) => (
                        <div
                            key={i}
                            className={`h-6 ${i === 3 ? 'w-1/2' : 'w-full'} bg-gray-300 rounded-md`}
                        />
                    ))}
                </div>
            </div>
            <div className={`w-full px-4 py-3 rounded-lg`}> 
                <div className="h-6 w-40 bg-gray-300 rounded-md mb-4" />

                <div className="space-y-3">
                    {Array(2).fill(null).map((_, i) => (
                        <div
                            key={i}
                            className={`h-18 ${i === 3 ? 'w-1/2' : 'w-full'} bg-gray-300 rounded-md`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )

}

export default TranscriptViewSkeleton;
