import React, { ReactNode } from 'react';
import Header from '../../components/header';

function BaseLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />
            <main className="flex justify-center items-center pt-24 pb-12">
                <div className="w-full max-w-7xl px-6">{children}</div>
            </main>
        </div>
    );
}

export default BaseLayout;
