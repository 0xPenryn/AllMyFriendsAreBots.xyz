import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { SessionProvider as Provider } from 'next-auth/react';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
      <Analytics />
    </>
  );
}

export default MyApp;
