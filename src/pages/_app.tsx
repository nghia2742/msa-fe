import ApolloProvider from '@/shared/provider/ApolloProvider';
import BaseLayout from '@/shared/ui/layout/base';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider>
            <BaseLayout>
                <Component {...pageProps} />
            </BaseLayout>
        </ApolloProvider>
    );
}
