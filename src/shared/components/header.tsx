import React from 'react';

const Header: React.FC = () => {
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development';
    
    const getEnvStyles = (env: string) => {
        switch (env.toLowerCase()) {
            case 'production':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'staging':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'test':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default:
                return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
            <nav className="w-full max-w-7xl flex items-center justify-between px-6 py-3 rounded-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:border-white/30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        M
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                        MSA
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`
                        flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border
                        transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-default
                        ${getEnvStyles(environment)}
                    `}>
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${environment === 'production' ? 'bg-emerald-400' : environment === 'staging' ? 'bg-amber-400' : 'bg-slate-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${environment === 'production' ? 'bg-emerald-500' : environment === 'staging' ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
                        </span>
                        <span className="uppercase tracking-wider">
                            {environment}
                        </span>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
