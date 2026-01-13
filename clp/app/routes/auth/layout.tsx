import { Outlet, type MetaFunction } from "react-router"
import AuthHero from "./components/AuthHero"
import AuthMap from "./components/AuthMap"

export const meta: MetaFunction = () => {
    return [
        { title: "Login / Signup" },
        { name: "description", content: `Welcome to CLP - a simple and secure way to sign up and log in. Create your account in a few easy steps: enter your email, set a password, choose a username, and add your details. You can sign in with your email and password, or use your Google or GitHub account to get started faster. The login page shows a friendly greeting that changes based on the time of day, displays the current time, and even celebrates holidays. We keep your account safe with password checks, email verification, and an easy way to reset your password if you forget it. CLP works great on your phone, tablet, or computer, so you can access your account from anywhere.` },
    ]
}

export const loader = async ({request}: {request: Request}) => {
    try {
        console.log("Auth Layout Loader")
        return null;
    }
    catch (error) {
        console.error(error)
        return null;
    }
}

export default function Layout() {
    return (
        <div className="md:fixed relative inset-0 flex flex-col md:flex-row bg-background text-foreground">
            <div className="relative z-10 flex-1 min-h-[60vh] md:min-h-screen flex flex-col justify-between px-6 sm:px-10 md:px-14 py-8 md:py-10 gap-8">

                <main className="flex-1 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <img
                                src="/icon.png"
                                alt="CLP logo"
                                className="h-7 w-7 rounded-md"
                                draggable={false}
                            />
                            <span className="text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
                                CLP CLOUD
                            </span>
                        </div>
                        <Outlet />
                        <p className="pt-3 text-[11px] text-muted-foreground leading-relaxed w-full items-center justify-center flex flex-wrap gap-1">
                            By signing up, you agree to our{" "}
                            <span className="underline underline-offset-2 decoration-muted-foreground/50">
                                terms of service
                            </span>{" "}
                            and{" "}
                            <span className="underline underline-offset-2 decoration-muted-foreground/50">
                                privacy policy
                            </span>
                            .
                        </p>
                    </div>
                </main>

                <footer className="flex items-center justify-between text-[11px] text-muted-foreground/70">
                    <span>LOCATIONS: 500+</span>
                    <button
                        type="button"
                        className="inline-flex items-center gap-1 text-muted-foreground/80 hover:text-foreground transition-colors"
                    >
                        <span className="h-[1px] w-4 bg-muted-foreground/40" />
                        SECURED BY CLP
                    </button>
                </footer>
            </div>

            <aside className="relative md:flex md:w-[55%] xl:w-[60%] md:border-l border-border bg-background border-t overflow-hidden">
                <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col">
                        <div className="px-10 pt-8 pb-2  w-full h-full">
                            <AuthHero />
                        </div>
                        <AuthMap />
                    </div>
                </div>
            </aside>
        </div>
    )
}