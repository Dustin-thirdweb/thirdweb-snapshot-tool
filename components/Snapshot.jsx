import React, { useState } from 'react';
import { Network, Alchemy } from 'alchemy-sdk';

const NetworkSelector: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(Network.ETH_MAINNET);
  const [alchemy, setAlchemy] = useState<Alchemy | null>(null);

  const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNetwork = event.target.value as Network;
    setSelectedNetwork(selectedNetwork);

    const apiKey = 'YOUR_ALCHEMY_API_KEY';
    const settings = {
      apiKey,
      network: selectedNetwork,
    };

    const alchemyInstance = new Alchemy(settings);
    setAlchemy(alchemyInstance);
  };

  const fetchLatestBlock = async () => {
    if (!alchemy) {
      console.error('Alchemy instance is not set');
      return;
    }

    const latestBlock = await alchemy.core.getBlock('latest');
    console.log(latestBlock);
  };

  return (
    <div>
      <label htmlFor="network-select">Select Network:</label>
      <select id="network-select" value={selectedNetwork} onChange={handleNetworkChange}>
        <option value={Network.ETH_MAINNET}>Ethereum Mainnet</option>
        <option value={Network.ETH_ROPSTEN}>Ethereum Ropsten</option>
        <option value={Network.MATIC_MAINNET}>Polygon Mainnet</option>
        <option value={Network.MATIC_TESTNET}>Polygon Testnet</option>
      </select>

      <button onClick={fetchLatestBlock}>Fetch Latest Block</button>
    </div>
  );
};

export default NetworkSelector;
