import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-green-800/30 bg-slate-900/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
                    <span>© {new Date().getFullYear()} Pepe Board</span>
                    <Link
                        to="/privacy-policy"
                        className="transition hover:text-green-400"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to="/terms-of-service"
                        className="transition hover:text-green-400"
                    >
                        Terms of Service
                    </Link>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Made by</span>
                    <a
                        href="https://kopter.me"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-green-400 transition hover:text-green-300"
                    >
                        Kopter
                        <ExternalLink size={14} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
