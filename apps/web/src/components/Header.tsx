import { Link } from "@tanstack/react-router";
import { ExternalLink, Github, Sparkles } from "lucide-react";

import BotStats from "./BotStats";

const INVITE_URL =
    "https://discord.com/oauth2/authorize?client_id=750365877844574248&scope=bot%20applications.commands&permissions=412317173824&redirect_uri=https%3A%2F%2Fpepeboard.xyz";

export default function Header() {
    return (
        <header className="border-b border-green-900/30 bg-slate-900/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 shadow-md shadow-green-900/50">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="text-lg font-bold leading-tight text-white">
                                Pepe Board Studio
                            </p>
                            <p className="text-sm text-slate-400">
                                Discord bot & instant meme boards
                            </p>
                        </div>
                    </Link>

                    <div className="hidden lg:block">
                        <BotStats />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <a
                        href={INVITE_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition hover:bg-green-500"
                    >
                        Add the bot
                        <ExternalLink size={15} />
                    </a>
                    <a
                        href="https://github.com/kop7er/PepeBoard"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-800/30 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-700/50"
                    >
                        <Github size={15} />
                        GitHub
                    </a>
                </div>
            </div>

            {/* Mobile stats display */}
            <div className="mx-auto max-w-7xl border-t border-green-900/20 px-4 py-3 lg:hidden">
                <BotStats />
            </div>
        </header>
    );
}
