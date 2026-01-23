import { Bell, Moon } from "lucide-react";

export function TopBar() {
    return (
        <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-xl sticky top-0 z-10">
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Welcome <span className="text-primary">User</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Start your PersonaAI Journey
                </p>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Last 7 Days</span>
                </div>

                <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
                    <Bell className="w-5 h-5 text-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    U
                </div>
            </div>
        </header>
    );
}
