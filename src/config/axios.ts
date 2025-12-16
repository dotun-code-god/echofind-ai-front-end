import axios from "axios";
import { getCookie } from "../libs/cookies";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})

api.interceptors.request.use((config) => {
    const token = getCookie("efai");

    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
})

export default api;