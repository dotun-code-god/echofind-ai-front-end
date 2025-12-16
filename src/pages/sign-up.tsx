import { useActionState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { signup, type AuthRequestState} from "../actions/auth";

const SignUp = () => {
    const navigate = useNavigate();

    const [state, formAction, isPending] = useActionState<AuthRequestState, FormData>(signup, {
        success: false,
        message: ""
    });

    useEffect(() => {
        if (state.success) {
            setTimeout(() => {
                navigate("/login");
            }, 500);
        }
    }, [state.success]);

    return (
        <div className="flex items-center justify-center h-screen flex-col bg-gradient-to-b from-blue-900 to-black text-white">
            <div className='fixed top-8 bg-[#fbfbf921] backdrop-blur-xl w-1/2 mx-auto p-4 rounded-full border-[0.01rem] border-white'>
                <div className='flex items-center justify-between'>
                    <h1>
                        <Link to="/">EchoFind</Link>
                    </h1>
                </div>
            </div>
            
            <form action={formAction} className="w-[400px] p-5 mx-auto border border-white bg-[#fbfbf921] backdrop-blur-xl">
                <h1 className="text-lg">Sign up</h1>

                { state.success ? (
                        <p className="text-green-600">{state.message}</p>
                    ) : (
                        <p className="text-red-600">{state.message}</p>
                    ) 
                }

                <div className="mt-4 grid gap-y-4">
                    <input 
                        type="text" 
                        name="username" 
                        className="border w-full p-3 outline-none" 
                        placeholder="Enter your username" 
                        />
                    <input 
                        type="email" 
                        name="email" 
                        className="border w-full p-3 outline-none" 
                        placeholder="Enter your email" 
                        />
                    <input 
                        type="password" 
                        name="password" 
                        className="border w-full p-3 outline-none" 
                        placeholder="Enter your password" 
                    />
                </div>

                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <button disabled={isPending} className="cursor-pointer mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition">
                        {isPending ? "Signing" : "Sign up"}
                    </button>

                    <Link to={"/login"} className="underline">Login?</Link>
                </div>
            </form>
        </div>
    )
}

export default SignUp;