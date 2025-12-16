import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {login} = useAuth();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [loggingIn, setLoggingIn]= useState(false);
    const [response, setResponse] = useState({
        success: false,
        message: ""
    });

    const loginUser = async() => {
        try{
            setLoggingIn(true);

            if (!username || !password) {
                return setResponse({
                    success: false,
                    message: "Username and password are required.",
                });
            }
            
            await login({username, password});

            setResponse({
                success: true,
                message: "User logged in successfully"
            })
        }catch(error:any){
            setResponse({
                success: false,
                message: error?.response?.data?.message || "An Error Occurred"
            })
        }finally{
            setLoggingIn(false);
        }
    }

    useEffect(() => {
        if (response.success) {
            setTimeout(() => {
                const redirctUrl = searchParams.get("red");
                redirctUrl ? navigate(redirctUrl) : navigate("/");
            }, 500);
        }
    }, [response.success]);
    
    return (
        <div className="flex items-center justify-center h-screen flex-col bg-gradient-to-b from-blue-900 to-black text-white">
            <div className='fixed top-8 bg-[#fbfbf921] backdrop-blur-xl w-1/2 mx-auto p-4 rounded-full border-[0.01rem] border-white'>
                <div className='flex items-center justify-between'>
                    <h1>
                        <Link to="/">EchoFind</Link>
                    </h1>
                </div>
            </div>
            
            <div className="w-[400px] p-5 mx-auto border border-white bg-[#fbfbf921] backdrop-blur-xl">
                <h1 className="text-lg">Login</h1>

                { response.success ? (
                        <p className="text-green-600">{response.message}</p>
                    ) : (
                        <p className="text-red-600">{response.message}</p>
                    ) 
                }

                <div className="mt-4 grid gap-y-4">
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border w-full p-3 outline-none" 
                        placeholder="Enter your username" 
                        />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border w-full p-3 outline-none" 
                        placeholder="Enter your password" 
                    />
                </div>

                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <button 
                        disabled={loggingIn} 
                        className="cursor-pointer mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
                        onClick={loginUser}
                    >
                        { loggingIn ? "Logging..." : "Login" }
                    </button>

                    <Link to={"/sign-up"} className="underline">Sign up?</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;