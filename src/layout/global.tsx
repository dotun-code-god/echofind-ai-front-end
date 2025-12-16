import Sidebar from "../common/sidebar";
import type { ReactNode } from "react";

const GlobalLayout = ({
    children
} : {
    children: ReactNode
}) => {
    
    return (
        <div className="flex w-screen">
            <Sidebar/>

            <div className="w-full h-full overflow-y-auto flex-1">
                {children}
            </div>
        </div>
    )
    
}

export default GlobalLayout;