'use client';

import { useWebsocket } from "@/ws/useWebsocket";

export default function Home() {
  const { isConnected, sendMessage, event } = useWebsocket<'Notification'>()

  return (
    <>
    dfsd
    </>
  );
}
