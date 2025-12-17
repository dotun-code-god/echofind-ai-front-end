import { useActionState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { signup, type AuthRequestState} from "../actions/auth";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
        <div className="flex items-center justify-center h-screen flex-col bg-gradient-to-b from-blue-900 to-black text-white px-4">
            <div className='fixed top-6 left-1/2 -translate-x-1/2'>
                <Link to="/" className="text-xl font-bold">EchoFind</Link>
            </div>

            <form action={formAction} className="w-full max-w-md p-8 mx-auto rounded-xl shadow-xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold">Create your account</h1>
                    <p className="text-sm text-white/80">Start using EchoFind with a free account</p>
                </div>

                {state.message ? (
                    <div className={`w-full p-3 rounded ${state.success ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
                        {state.message}
                    </div>
                ) : null}

                <div className="mt-4 grid gap-y-3">
                    <Input type="text" name="username" placeholder="Username" aria-label="username" />
                    <Input type="email" name="email" placeholder="Email address" aria-label="email" />
                    <Input type="password" name="password" placeholder="Password" aria-label="password" />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <Button variant="default" asChild={false} disabled={isPending}>
                        <button type="submit" className="w-full">{isPending ? 'Creating...' : 'Create account'}</button>
                    </Button>

                    <div className="text-center text-sm text-white/80">
                        Already have an account? <Link to="/login" className="underline">Sign in</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SignUp;