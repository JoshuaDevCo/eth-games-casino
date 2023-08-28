import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ethers } from "ethers";
import { BrowserRouter } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { GlobalProvider } from "./contexts/GlobalContext";
import { ReduxContext } from "./contexts/ReduxContext";
import { WalletProvider } from "./contexts/WalletContext";
import { ContractProvider } from "./contexts/ContractContext";

const getLibrary = (provider) => {
  const library = new ethers.BrowserProvider(provider);
  // console.log('library: ', library);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <GlobalProvider>
        <ReduxContext>
          <WalletProvider>
            <ContractProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ContractProvider>
          </WalletProvider>
        </ReduxContext>
      </GlobalProvider>
    </Web3ReactProvider>
  </React.StrictMode>
);
