import api from "../config/axios";
import { saveCookie } from "../libs/cookies";

export type AuthRequestState = {
    success: boolean;
    message: string;
}

export const signup = async(state: AuthRequestState, formData: FormData) : Promise<AuthRequestState> => {
    
    const username = formData.get("username")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!username || !email || !password) {
        return {
            success: false,
            message: "Email and password are required.",
        };
    }
    
    try{
        const {data} = await api.post("/auth/register", formData);
        
        return {
            success: true,
            message: data,
        }
    }catch(error: any){
        return {
            success: false,
            message: error.message,
        }
    }
    
}
