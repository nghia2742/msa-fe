import { ApolloProvider as OriginalApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ReactNode } from 'react';

function createApolloClient() {
    return new ApolloClient({
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_BFF_ENDPOINT ?? 'http://localhost:4000/bff',
        }),
        cache: new InMemoryCache(),
    });
}
const client = createApolloClient();

export default function ApolloProvider({ children }: { children: ReactNode }) {
    return (
        <OriginalApolloProvider client={client}>
            {children}
        </OriginalApolloProvider>
    );
}
