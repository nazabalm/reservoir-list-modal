"use client";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider, useAccount } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { baseSepolia } from "viem/chains";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";

import { reservoirChains } from "@reservoir0x/reservoir-sdk";
import { ReservoirKitProvider, darkTheme } from "@reservoir0x/reservoir-kit-ui";

const config = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const theme = darkTheme({
  headlineFont: "Sans Serif",
  font: "Serif",
  primaryColor: "#323aa8",
  primaryHoverColor: "#252ea5",
});

function AccountInfo() {
  const { address, isConnected, chain } = useAccount();

  return (
    <div>
      <p>wagmi connected: {isConnected ? "true" : "false"}</p>
      <p>wagmi address: {address}</p>
      <p>wagmi network: {chain?.id}</p>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DynamicContextProvider
          settings={{
            environmentId: "beee4160-cd13-4d71-a95c-c6a941d5bfde",
            walletConnectors: [
              EthereumWalletConnectors,
              ZeroDevSmartWalletConnectors,
            ],
          }}
        >
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
              <DynamicWagmiConnector>
                <DynamicWidget />
                <AccountInfo />
                <ReservoirKitProvider
                  options={{
                    apiKey: "afa46d88-b8b0-5702-9fcd-2410de9e1538",
                    chains: [
                      {
                        ...reservoirChains.baseSepolia,
                        active: true,
                      },
                    ],
                  }}
                  theme={theme}
                >
                  {children}
                </ReservoirKitProvider>
              </DynamicWagmiConnector>
            </WagmiProvider>
          </QueryClientProvider>
        </DynamicContextProvider>
      </body>
    </html>
  );
}
