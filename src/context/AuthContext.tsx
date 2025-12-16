import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import api from "../config/axios";
import { getCookie, removeCookie, saveCookie } from "../libs/cookies";
import axios from "axios";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    login: (payload: LoginDTO) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    fetchingUser:boolean;
    setFetchingUser: Dispatch<SetStateAction<boolean>>;
}

type LoginDTO = {
    username: string;
    password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
    children
} : {
    children: ReactNode
}) => {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState(getCookie("efai") || null);
    const isAuthenticated = !!token;
    const [fetchingUser, setFetchingUser] = useState(false);

    const login = async(payload: LoginDTO) =>  {
        const {data} = await api.post("/auth/login", payload);
        saveCookie("efai", data);
        setToken(data);

        await fetchUser(data);
    };

    const fetchUser = async(jwt?: string) => {
        try{
            setFetchingUser(true);
            const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/me`, {}, {
                headers: {
                    Authorization: `Bearer ${jwt || token}`
                },
                withCredentials: true
            });
    
            setUser(data);
        }catch(err){
            setUser(null);
        }finally{
            setFetchingUser(false);
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        removeCookie("efai");
    };

    useEffect(() => {
        if(token) fetchUser();
    }, [token]);

    return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, fetchingUser, setFetchingUser }}>
      {children}
    </AuthContext.Provider>
  );
    
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx)
        throw new Error("useAuth ust be used inside AuthProvider")
    
    return ctx;
}