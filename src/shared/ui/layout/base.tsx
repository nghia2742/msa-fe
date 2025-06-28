import React, { ReactNode } from 'react';

function BaseLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="max-w-2/3">{children}</div>
        </div>
    );
}

export default BaseLayout;
