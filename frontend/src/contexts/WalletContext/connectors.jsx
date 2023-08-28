import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 5, 31337]
});

const walletconnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/7535811d19b1410e98c261fbb638651a`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
};
