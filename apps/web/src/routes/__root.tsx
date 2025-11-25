import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import Footer from "../components/Footer";
import Header from "../components/Header";

export const Route = createRootRoute({
    component: () => (
        <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(74,222,128,0.15),transparent_50%)]" />
            <Header />
            <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6">
                <Outlet />
            </main>
            <Footer />
            <TanStackDevtools
                plugins={[
                    {
                        name: "Tanstack Router",
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                ]}
            />
        </div>
    ),
});
