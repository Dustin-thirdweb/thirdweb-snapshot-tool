import Image from 'next/image';
import { Inter } from 'next/font/google';
import React, { useState } from 'react';
const { Alchemy, Network } = require('alchemy-sdk');
import styles from "../styles/Airdrop.module.css";

const inter = Inter({ subsets: ['latin'] });

const Snapshot = () => {
  const [address, setAddress] = useState('empty');
  const [fetchedOwners, setFetchedOwners] = useState(false);
  const [owners, setOwners] = useState({ owners: [] });
  const [showMore, setShowMore] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(Network.ETH_MAINNET);

  const handleNetworkChange = (event) => {
    const value = event.target.value;
    setSelectedNetwork(value);
  };

  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    network: selectedNetwork,
  };
  const alchemy = new Alchemy(config);

  const getList = async () => {
    const ownersList = await alchemy.nft.getOwnersForContract(address, false);
    setOwners(ownersList);
    console.log(ownersList.owners);
    setFetchedOwners(true);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setAddress(value);
  };

  const exportToCsv = () => {
    const filename = 'Snapshot';
    const separator = ',';
    let csv = '';

    owners.owners.forEach((value) => {
      const cell = value == null ? '' : `"${value.toString()}"`; // Put the address in double quotes
      csv += cell + separator;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadMoreAddresses = () => {
    setShowMore(true);
  };

  if (fetchedOwners) {
    return (
      <div className={styles.container}>
        <br />
        <main className={styles.main}>
          <br />
          <h1 className={styles.title}>Snapshot Tool</h1>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h2 className={styles.title}>Quickly generate a list of current holders</h2>
              <h3>
                <label htmlFor="tokenAddress">Token Address:</label>
              </h3>

              <input
                type='text'
                placeholder='Enter token address 0x..'
                onChange={handleChange}
                className={styles.inputStyle}
              ></input>

              <h3>Select your chain:</h3>
              <select
                value={selectedNetwork}
                onChange={handleNetworkChange}
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #111111",
                  backgroundColor: "#111111",
                  borderRadius: "4px",
                  width: "400px"
                }}
              >
                <option value={Network.ETH_MAINNET}>Ethereum</option>
                <option value={Network.POLYGON}>Polygon</option>
                <option value={Network.MUMBAI}>Mumbai</option>
                <option value={Network.GOERLI}>Goerli</option>
                <option value={Network.ARBITRUM}>Arbitrum One</option>
                <option value={Network.ARBITRUM_GOERLI}>Arbitrum Goerli</option>
                <option value={Network.OPTIMISM}>Optimism</option>
                <option value={Network.BINANCE}>Binance SmartChain</option>
                <option value={Network.BINANCE_TESTNET}>Binance SmartChain Testnet</option>
                <option value={Network.FANTOM}>Fantom Opera</option>
                <option value={Network.FANTOM_TESTNET}>Fantom Testnet</option>
                <option value={Network.AVALANCHE_FUJI}>Avalanche C Chain</option>
                <option value={Network.AVALANCHE_FUJI_TESTNET}>Avalanche Fuji Testnet</option>
              </select>

              <div className={styles.button}>
                <div className={styles.button}>
                  <button
                    className={styles.button}
                    onClick={() => getList()}
                  >
                    Get holders
                  </button>
                </div>
                <br />
                {/* <div className={styles.button}>
                                    <button
                                        className={styles.button}
                                        onClick={() => exportToCsv()}
                                    >
                                        Export List as .csv
                                    </button>
                                </div> */}
              </div>

              <div className={styles.addressList}>
                {owners.owners.slice(0, showMore ? owners.owners.length : 200).map((item, index) => (
                  <div key={item} className={styles.addressItem}>
                    {"\""}{item}{"\""}{index !== owners.owners.length - 1 && ','}
                  </div>
                ))}
              </div>

              {!showMore && (
                <div className={styles.button}>
                  <button
                    className={styles.button}
                    onClick={loadMoreAddresses}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <br />
      <main className={styles.main}>
        <br />
        <h1 className={styles.title}>Snapshot Tool</h1>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.title}>Quickly generate a list of current holders</h2>
            <h3>
              <label htmlFor="tokenAddress">Token Address:</label>
            </h3>

            <input
              type='text'
              placeholder='Enter token address 0x..'
              onChange={handleChange}
              className={styles.inputStyle}
            // style={{ color: 'black' }}
            ></input>

            {/* <h3>Select your chain:</h3>
            <select
              value={selectedNetwork}
              onChange={handleNetworkChange}
              style={{
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #111111",
                backgroundColor: "#111111",
                borderRadius: "4px",
                width: "400px"
              }}
            >
              <option value={Network.ETH_MAINNET}>Ethereum</option>
              <option value={Network.POLYGON}>Polygon</option>
              <option value={Network.MUMBAI}>Mumbai</option>
              <option value={Network.GOERLI}>Goerli</option>
              <option value={Network.ARBITRUM}>Arbitrum One</option>
              <option value={Network.ARBITRUM_GOERLI}>Arbitrum Goerli</option>
              <option value={Network.OPTIMISM}>Optimism</option>
              <option value={Network.BINANCE}>Binance SmartChain</option>
              <option value={Network.BINANCE_TESTNET}>Binance SmartChain Testnet</option>
              <option value={Network.FANTOM}>Fantom Opera</option>
              <option value={Network.FANTOM_TESTNET}>Fantom Testnet</option>
              <option value={Network.AVALANCHE_FUJI}>Avalanche C Chain</option>
              <option value={Network.AVALANCHE_FUJI_TESTNET}>Avalanche Fuji Testnet</option>
            </select> */}

            <div className={styles.card}>
              <button
                className={styles.button}
                onClick={() => getList()}
              // style={{ color: 'white' }}
              >
                Get holders
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Snapshot;
