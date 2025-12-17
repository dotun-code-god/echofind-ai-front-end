import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router";
import GlobalLayout from "../layout/global";
import AuthenticationSkeleton from "../components/SkeletonComponent/AuthenticationSkeleton";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    
    const { user, fetchingUser } = useAuth();
    const { pathname } = useLocation();

    if (fetchingUser) {
        console.log("Authenticating: Waiting for user status...");
        return <AuthenticationSkeleton />;
    }
    
    if (!user) {
        console.log("Authentication complete. User not found. Redirecting to login.");
        
        const redirectTo = `/login${pathname ? "?red=" + pathname : ""}`;

        return <Navigate to={redirectTo} replace />;
    }
    
    console.log("Authentication complete. User found. Rendering content.");
    return (
        <GlobalLayout>
            {children}
        </GlobalLayout>
    );
}

export default ProtectedRoute;