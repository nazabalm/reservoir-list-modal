"use client";
import { useEffect, useState } from "react";
import { BuyModal, ListModal } from "@reservoir0x/reservoir-kit-ui";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Account, Chain, Transport, WalletClient } from "viem";
import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa";

// const CONTRACT_ADDRESS = '0x345fcbdc9340138a2b9aa70332e3ae1e62f20015'

const ListHorse = () => {
  const openState = useState(false);
  const { primaryWallet } = useDynamicContext();

  const [walletClient, setWalletClient] =
    useState<WalletClient<Transport, Chain, Account>>();

  useEffect(() => {
    const getWalletClient = async () => {
      if (!primaryWallet) return;

      console.log("primary wallet", primaryWallet);

      const connector = primaryWallet?.connector;
      console.log("connector", connector);

      if (!isZeroDevConnector(connector)) {
        return;
      }

      const newKernelAccount = connector.kernelClientWithSponsorship;
      console.log("kernelclient", newKernelAccount);

      if (!newKernelAccount) {
        return;
      }

      // Needs type assertion as getWalletClient returns value is defined as unknown
      const wc = (await connector.getWalletClient()) as WalletClient<
        Transport,
        Chain,
        Account
      >;

      setWalletClient(wc);
    };
    getWalletClient();
  }, [primaryWallet, primaryWallet?.connector?.kernelClientWithSponsorship]);

  if (!walletClient) return null;

  return (
    <ListModal
      trigger={<button>List Item</button>}
      collectionId="0x345fcbdc9340138a2b9aa70332e3ae1e62f20015"
      tokenId="114"
      openState={openState}
      oracleEnabled={false}
      onGoToToken={() => console.log("Awesome!")}
      onListingComplete={(data) => {
        console.log("Listing Complete", data);
      }}
      onListingError={(error, data) => {
        console.log("Transaction Error", error, data);
      }}
      onClose={(data, stepData, currentStep) => {
        console.log("ListModal Closed");
      }}
      walletClient={walletClient}
    />
  );
};

export default ListHorse;
