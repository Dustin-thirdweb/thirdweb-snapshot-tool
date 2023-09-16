import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import ChainContext from "../context/Chain";
import { ThirdwebProvider } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: AppProps) {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const clientId = ""; // get your clientId here https://thirdweb.com/create-api-key

  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
      <ThirdwebProvider activeChain={selectedChain} clientId={clientId}>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChainContext.Provider>
  );
}

export default MyApp;