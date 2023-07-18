import React, { useState } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { constants } from 'ethers';
import styles from "../styles/Airdrop.module.css"

const NetworkSelector = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(Network.ETH_MAINNET);
  const [contractAddress, setContractAddress] = useState('');
  const [fetchedOwners, setFetchedOwners] = useState(false);
  const [alchemy, setAlchemy] = useState(null);
  const [owners, setOwners] = useState({ owners: [], balanceMap: {} });
  const [showMore, setShowMore] = useState(false);
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [erc, setErc] = useState('erc1155'); // New state for ERC type
  const [tokenId, setTokenId] = useState('5');
  const [isLoadingConnect, setIsLoadingConnect] = useState(false); // State for Connect button loading
  const [isLoadingFetch, setIsLoadingFetch] = useState(false); // State for Fetch Holders button loading
  const [isConnected, setIsConnected] = useState(false); // State for connection status
  const [isGeneratingSnapshot, setIsGeneratingSnapshot] = useState(false); // State for generating snapshot

  const sdk = new ThirdwebSDK(selectedChain);

  const handleNetworkChange = (event) => {
    const selectedNetwork = event.target.value;
    setSelectedNetwork(selectedNetwork);

    // Set the selectedChain based on the selected network
    if (selectedNetwork === Network.ETH_MAINNET) {
      setSelectedChain('ethereum');
    } else if (selectedNetwork === Network.MATIC_MAINNET) {
      setSelectedChain('polygon');
    }
    else {
      setSelectedChain('ethereum'); // Set a default chain in case the selected network is not recognized
    }
  };

  const handleTokenIdChange = (event) => {
    const value = event.target.value;
    setTokenId(value);
  };

  const handleContractAddressChange = (event) => {
    const contractAddress = event.target.value;
    setContractAddress(contractAddress);
  };

  const handleErcChange = (event) => {
    const selectedErc = event.target.value;
    setErc(selectedErc);
  };

  const handleConnect = async () => {
    setIsLoadingConnect(true); // Set loading state to true

    let apiKey = '';
    if (selectedNetwork === Network.ETH_MAINNET) {
      apiKey = '6-90BgxFbFRS5xkhht5avVs984g9oNWt';
    } else if (selectedNetwork === Network.MATIC_MAINNET) {
      apiKey = 'OJFz0yLyyB9QOOBvsPNK9dNVYWxCJYBo';
    }

    const settings = {
      apiKey,
      network: selectedNetwork,
    };

    try {
      const alchemyInstance = new Alchemy(settings);
      setAlchemy(alchemyInstance);
      setIsConnected(true); // Set connected state to true
    } catch (error) {
      console.error('Error connecting:', error);
      // Handle the error (e.g., display an error message)
    } finally {
      setIsLoadingConnect(false); // Set loading state to false
    }
  };

  const getList = async () => {
    setIsLoadingFetch(true); // Set loading state to true

    try {
      const contract = await sdk.getContract(contractAddress);

      let addresses = [];

      const apiKey =
        selectedNetwork === Network.ETH_MAINNET
          ? process.env.NEXT_PUBLIC_ALCHEMY_ID
          : process.env.NEXT_PUBLIC_ALCHEMY_POLY_ID;
      const config = {
        apiKey,
        network: selectedNetwork,
      };
      const alchemy = new Alchemy(config);

      setIsGeneratingSnapshot(true); // Set generating snapshot state to true

      if (erc === 'erc1155') {
        addresses = (
          await alchemy.nft.getOwnersForNft(contractAddress, tokenId)
        ).owners.filter((addr) => addr !== constants.AddressZero);
      } else if (erc === 'erc721') {
        addresses = (
          await alchemy.nft.getOwnersForContract(contractAddress)
        ).owners.filter((addr) => addr !== constants.AddressZero);
      }

      const balanceMap = {};
      for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];
        let balance = 0;
        if (erc === 'erc1155') {
          balance = await contract.erc1155.balanceOf(addr, tokenId);
        } else if (erc === 'erc721') {
          balance = await contract.erc721.balanceOf(addr);
        }
        balanceMap[addr] = balance.toString();
      }

      setOwners({ owners: addresses, balanceMap });
      setFetchedOwners(true);
    } catch (error) {
      console.error('Error fetching holders:', error);
      // Handle the error (e.g., display an error message)
    } finally {
      setIsLoadingFetch(false); // Set loading state to false
      setIsGeneratingSnapshot(false); // Set generating snapshot state to false
    }
  };

  const loadMoreAddresses = () => {
    setShowMore(true);
  };

  const exportSnapshotToCSV = () => {
    const csvRows = [];
    csvRows.push(['Address', 'MaxClaimable']);

    for (const address of owners.owners) {
      const maxClaimable = owners.balanceMap[address];
      csvRows.push([address, maxClaimable]);
    }

    const csvData = csvRows.map(row => row.join(',')).join('\n');
    const csvBlob = new Blob([csvData], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = 'snapshot.csv';
    link.click();
    URL.revokeObjectURL(csvUrl);
  };

  return (
    <div className={styles.networkSelector}>
      <label htmlFor="network-select" className={styles.label}>
        Select Network:
      </label>
      <select
        id="network-select"
        value={selectedNetwork}
        onChange={handleNetworkChange}
        className={styles.input}
      >
        <option value={Network.ETH_MAINNET}>Ethereum Mainnet</option>
        <option value={Network.MATIC_MAINNET}>Polygon Mainnet</option>
      </select>

      <label htmlFor="contract-address-input" className={styles.label}>
        Contract Address:
      </label>
      <input
        type="text"
        id="contract-address-input"
        value={contractAddress}
        onChange={handleContractAddressChange}
        className={styles.input}
      />

      <label htmlFor="erc-select" className={styles.label}>
        Select ERC Type:
      </label>
      <select
        id="erc-select"
        value={erc}
        onChange={handleErcChange}
        className={styles.input}
      >
        <option value="erc1155">ERC1155</option>
        <option value="erc721">ERC721</option>
      </select>

      <div className={styles.buttonContainer}>
        <button
          onClick={isLoadingConnect ? undefined : (isConnected ? getList : handleConnect)}
          className={`${styles.button} ${isLoadingConnect ? styles.loading : ''}`}
          disabled={isLoadingConnect || (isLoadingFetch && isGeneratingSnapshot)}
        >
          {isLoadingConnect ? 'Connecting...' : (isConnected ? 'Fetch Holders' : 'Connect')}
        </button>
        {isLoadingFetch && isGeneratingSnapshot && (
          <div className={styles.loadingAnimation}>Generating snapshot...</div>
        )}
        {fetchedOwners && !isLoadingFetch && (
          <button
            onClick={exportSnapshotToCSV}
            className={styles.exportButton}
          >
            Export Snapshot
          </button>
        )}
      </div>

      <table className={styles.addressTable}>
        <thead>
          <tr>
            <th className={styles.addressColumn}>Address</th>
            <th className={styles.balanceColumn}>Token Balance</th>
          </tr>
        </thead>
        <tbody>
          {owners.owners
            .slice(0, showMore ? owners.owners.length : 200)
            .map((address, index) => (
              <tr key={address}>
                <td className={styles.addressCell}>{address}</td>
                <td className={styles.balanceCell}>{owners.balanceMap[address]}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {!showMore && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={loadMoreAddresses}
            className={styles.loadMoreButton}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;
