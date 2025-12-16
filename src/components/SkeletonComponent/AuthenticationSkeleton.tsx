const AuthenticationSkeleton = () => {
    return (
        <div className={`relative animate-pulse m-4`}>
            <div className="flex gap-4">
                <div className="w-72 h-[calc(100vh-100px)] bg-gray-300"> </div>

                <div className="flex-1 w-full h-full overflow-auto">
                    <div className="w-full relative grid gap-3">
                        {Array(4).fill(null).map((_,i) => 
                            <li key={i} className="h-20 cursor-pointer bg-gray-300 rounded-xl flex items-center gap-3" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthenticationSkeleton;