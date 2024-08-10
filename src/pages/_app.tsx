import { WebsocketProvider } from "@/ws/useWebsocket";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (<WebsocketProvider>
    <Component {...pageProps} />;
  </WebsocketProvider>);
}
