import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
        <div className="flex items-center justify-center h-screen flex-col bg-gradient-to-b from-blue-900 to-black text-white px-4">
            <div className='fixed top-6 left-1/2 -translate-x-1/2'>
                <Link to="/" className="text-xl font-bold">EchoFind</Link>
            </div>

            <div className="w-full max-w-md p-8 mx-auto rounded-xl shadow-xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold">Welcome back</h1>
                    <p className="text-sm text-white/80">Sign in to continue to your account</p>
                </div>

                {response.message ? (
                    <div className={`w-full p-3 rounded ${response.success ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
                        {response.message}
                    </div>
                ) : null}

                <div className="mt-4 grid gap-y-3">
                    <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username or email"
                        aria-label="username"
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        aria-label="password"
                    />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 bg-white/5" />
                        <span className="text-white/80">Remember me</span>
                    </label>
                    <Link to="/forgot" className="text-sm underline text-white/80">Forgot?</Link>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <Button variant="default" onClick={loginUser} disabled={loggingIn}>
                        {loggingIn ? 'Logging...' : 'Sign in'}
                    </Button>

                    <div className="text-center text-sm text-white/80">
                        Don’t have an account? <Link to="/sign-up" className="underline">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Login;