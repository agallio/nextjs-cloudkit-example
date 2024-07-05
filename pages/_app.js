import "@/styles/globals.css";

import { Inter } from "next/font/google";
import Head from "next/head";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const client = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SwiftDataTodo (Next.js)</title>
      </Head>

      {/* Declare font globally */}
      <style jsx global>{`
        :root {
          --font-inter: ${interFont.style.fontFamily};
        }
      `}</style>

      <QueryClientProvider client={client}>
        <main className="antialiased">
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </>
  );
}
