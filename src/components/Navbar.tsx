"use client";

interface NavbarProps {
    title?: string;
}

export default function Navbar({ title = "Dashboard" }: NavbarProps) {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-300 bg-white px-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
            {/* Left: Page title */}
            <div>
                <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                </h1>
            </div>

            {/* Right: Search + actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden sm:block">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="h-9 w-52 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                    />
                </div>

                {/* Notifications */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                </button>

                {/* Avatar */}
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-500/20 dark:text-indigo-400">
                    JD
                </button>
            </div>
        </header>
    );
}