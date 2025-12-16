import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

const PublicRoute = ({children} : {children: ReactNode}) => {
    const {isAuthenticated} = useAuth();

    if(isAuthenticated) return <Navigate to={"/"} replace />

    return children
}

export default PublicRoute;