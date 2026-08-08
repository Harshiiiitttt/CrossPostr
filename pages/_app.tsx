import type { AppProps } from "next/app";
import { BlogGenerationProvider } from "@/lib/BlogGenerationContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BlogGenerationProvider>
      <Component {...pageProps} />
    </BlogGenerationProvider>
  );
}
