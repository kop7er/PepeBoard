import { Server, Users } from "lucide-react";

export default function BotStats() {
    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-slate-300">
                <Server size={16} className="text-green-400" />
                <span className="font-semibold">200+</span>
                <span className="text-slate-400">servers</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-300">
                <Users size={16} className="text-green-400" />
                <span className="font-semibold">10K+</span>
                <span className="text-slate-400">users</span>
            </div>
        </div>
    );
}
