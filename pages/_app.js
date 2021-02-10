import "../styles/global.css";

import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { TextileProvider } from "../contexts/textile";

function getLibrary(provider) {
  return new Web3Provider(provider);
}

export default function App({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <TextileProvider>
        <Component {...pageProps} />
      </TextileProvider>
    </Web3ReactProvider>
  );
}
