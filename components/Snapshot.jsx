// import React, { useState } from 'react';
// import { Alchemy, Network } from 'alchemy-sdk';
// import { ThirdwebSDK } from '@thirdweb-dev/sdk';
// import { constants } from 'ethers';

// import styles from "../styles/Airdrop.module.css";

// const Snapshot = () => {
//     const [address, setAddress] = useState('empty');
//     const [fetchedOwners, setFetchedOwners] = useState(false);
//     const [owners, setOwners] = useState({ owners: [] });
//     const [showMore, setShowMore] = useState(false);
//     const [selectedNetwork, setSelectedNetwork] = useState(Network.ETH_MAINNET);
//     const [erc, setErc] = useState('erc1155');
//     const [tokenId, setTokenId] = useState('5');
//     const [selectedChain, setSelectedChain] = useState('ethereum');
//     const sdk = new ThirdwebSDK(selectedChain);

//     const handleNetworkChange = (event) => {
//         const value = event.target.value;
//         setSelectedNetwork(value);
//         setSelectedChain(value);
//     };

//     const chainOptions = [
//         { label: 'Ethereum', value: Network.ETH_MAINNET },
//         { label: 'Goerli', value: Network.GOERLI },
//         { label: 'Polygon', value: Network.POLYGON },
//         { label: 'Mumbai', value: Network.MUMBAI },
//         { label: 'Arbitrum One', value: Network.ARBITRUM },
//         { label: 'Arbitrum Goerli', value: Network.ARBITRUM_GOERLI },
//         { label: 'Optimism', value: Network.OPTIMISM },
//         { label: 'Optimism Goerli Testnet', value: Network.OPTIMISM_GOERLI },
//         { label: 'Binance SmartChain', value: Network.BINANCE },
//         { label: 'Binance SmartChain Testnet', value: Network.BINANCE_TESTNET },
//         { label: 'Fantom Opera', value: Network.FANTOM },
//         { label: 'Fantom Testnet', value: Network.FANTOM_TESTNET },
//         { label: 'Avalanche C Chain', value: Network.AVALANCHE_FUJI },
//         { label: 'Avalanche Fuji Testnet', value: Network.AVALANCHE_FUJI_TESTNET },
//     ];

//     const getList = async () => {
//         try {
//             const contract = await sdk.getContract(address);
//             let addresses = [];
    
//             const config = {
//                 apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
//                 network: selectedChain === 'ethereum' ? Network.ETH_MAINNET : Network.POLYGON,
//             };
//             const alchemy = new Alchemy(config);
    
//             if (erc === 'erc1155') {
//                 addresses = (
//                     await alchemy.nft.getOwnersForNft(address, tokenId)
//                 ).owners.filter((addr) => addr !== constants.AddressZero);
//             } else if (erc === 'erc721') {
//                 addresses = (
//                     await alchemy.nft.getOwnersForContract(address)
//                 ).owners.filter((addr) => addr !== constants.AddressZero);
//             }
    
//             const balanceMap = {};
//             for (let i = 0; i < addresses.length; i++) {
//                 const addr = addresses[i];
//                 let balance = 0;
//                 if (erc === 'erc1155') {
//                     balance = await contract.balanceOf(addr, tokenId);
//                 } else if (erc === 'erc721') {
//                     balance = await contract.balanceOf(addr);
//                 }
//                 balanceMap[addr] = balance.toString();
//             }
    
//             setOwners({ owners: addresses, balanceMap });
//             setFetchedOwners(true);
//         } catch (error) {
//             console.error('Error fetching owners:', error);
//             // Handle the error (e.g., display an error message)
//         }
//     };

//     const handleChange = (event) => {
//         const value = event.target.value;
//         setAddress(value);
//     };

//     const handleTokenIdChange = (event) => {
//         const value = event.target.value;
//         setTokenId(value);
//     };

//     const exportToCsv = async () => {
//         const filename = 'Snapshot.csv';

//         const balanceMap = {};
//         for (let i = 0; i < owners.owners.length; i++) {
//             const address = owners.owners[i];
//             let balance = 0;
//             if (erc === 'erc1155') {
//                 balance = await contract.erc1155.balanceOf(address, tokenId);
//             } else if (erc === 'erc721') {
//                 balance = await contract.erc721.balanceOf(address);
//             }
//             balanceMap[address] = balance.toString();
//         }

//         const csvContent = owners.owners
//             .map((address) => [address, balanceMap[address]])
//             .map((row) => row.map((cell) => (cell == null ? '' : `"${cell.toString()}"`)).join(','))
//             .join('\n');

//         const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const csvUrl = URL.createObjectURL(csvBlob);
//         const downloadLink = document.createElement('a');
//         downloadLink.href = csvUrl;
//         downloadLink.download = filename;
//         downloadLink.style.display = 'none';
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//     };

//     const loadMoreAddresses = () => {
//         setShowMore(true);
//     };

//     return (
//         <div className={styles.container}>
//             <br />
//             <main className={styles.main}>
//                 <br />
//                 <h1 className={styles.title}>Snapshot Tool</h1>
//                 <div className={styles.grid}>
//                     <div className={styles.card}>
//                         <h2 className={styles.title}>Quickly generate a list of current holders</h2>
//                         <h3>
//                             <label htmlFor="tokenAddress">Token Address:</label>
//                         </h3>

//                         <input
//                             type='text'
//                             placeholder='Enter token address 0x..'
//                             onChange={handleChange}
//                             className={styles.inputStyle}
//                         />

//                         <h3>Select token type:</h3>
//                         <select
//                             value={erc}
//                             onChange={(event) => setErc(event.target.value)}
//                             className={styles.selectStyle}
//                         >
//                             <option key="erc721" value="erc721">ERC721</option>
//                             <option key="erc1155" value="erc1155">ERC1155</option>
//                         </select>

//                         {erc === 'erc1155' && (
//                             <div>
//                                 <h3>Token ID:</h3>
//                                 <input
//                                     type='text'
//                                     value={tokenId}
//                                     onChange={handleTokenIdChange}
//                                     className={styles.inputStyle}
//                                 />
//                             </div>
//                         )}

//                         <h3>Select your chain:</h3>
//                         <select
//                             value={selectedNetwork}
//                             onChange={handleNetworkChange}
//                             className={styles.selectStyle}
//                         >
//                             {chainOptions.map((option, index) => (
//                                 <option key={index} value={option.value}>
//                                     {option.label}
//                                 </option>
//                             ))}
//                         </select>

//                         <div className={styles.button}>
//                             <button
//                                 className={styles.button}
//                                 onClick={getList}
//                             >
//                                 Get holders
//                             </button>
//                         </div>

//                         {fetchedOwners && (
//                             <div>
//                                 <div className={styles.button}>
//                                     <button
//                                         className={styles.button}
//                                         onClick={exportToCsv}
//                                     >
//                                         Export List as .csv
//                                     </button>
//                                 </div>

//                                 <div className={styles.addressList}>
//                                     {owners.owners.slice(0, showMore ? owners.owners.length : 200).map((item, index) => (
//                                         <div key={item} className={styles.addressItem}>
//                                             {"\""}{item}{"\""}{index !== owners.owners.length - 1 && ','}
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {!showMore && (
//                                     <div className={styles.button}>
//                                         <button
//                                             className={styles.button}
//                                             onClick={loadMoreAddresses}
//                                         >
//                                             Load More
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Snapshot;
import React, { useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { constants } from 'ethers';

import styles from "../styles/Airdrop.module.css";

const Snapshot = () => {
  const [address, setAddress] = useState('empty');
  const [fetchedOwners, setFetchedOwners] = useState(false);
  const [owners, setOwners] = useState({ owners: [], balanceMap: {} });
  const [showMore, setShowMore] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(Network.ETH_MAINNET);
  const [erc, setErc] = useState('erc1155');
  const [tokenId, setTokenId] = useState('5');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const sdk = new ThirdwebSDK(selectedChain);

  const handleNetworkChange = (event) => {
    const value = event.target.value;
    setSelectedNetwork(value);
    setSelectedChain(value);
  };

  const chainOptions = [
    { label: 'Ethereum', value: Network.ETH_MAINNET },
    { label: 'Goerli', value: Network.GOERLI },
    { label: 'Polygon', value: Network.POLYGON },
    { label: 'Mumbai', value: Network.MUMBAI },
    { label: 'Arbitrum One', value: Network.ARBITRUM },
    { label: 'Arbitrum Goerli', value: Network.ARBITRUM_GOERLI },
    { label: 'Optimism', value: Network.OPTIMISM },
    { label: 'Optimism Goerli Testnet', value: Network.OPTIMISM_GOERLI },
    { label: 'Binance SmartChain', value: Network.BINANCE },
    { label: 'Binance SmartChain Testnet', value: Network.BINANCE_TESTNET },
    { label: 'Fantom Opera', value: Network.FANTOM },
    { label: 'Fantom Testnet', value: Network.FANTOM_TESTNET },
    { label: 'Avalanche C Chain', value: Network.AVALANCHE_FUJI },
    { label: 'Avalanche Fuji Testnet', value: Network.AVALANCHE_FUJI_TESTNET },
  ];

  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    network: selectedNetwork,
  };
  const alchemy = new Alchemy(config);

  const getList = async () => {
    const contract = await sdk.getContract(address);
    let addresses = [];

    if (erc === 'erc1155') {
      addresses = (
        await alchemy.nft.getOwnersForNft(address, tokenId)
      ).owners.filter((addr) => addr !== constants.AddressZero);
    } else if (erc === 'erc721') {
      addresses = (
        await alchemy.nft.getOwnersForContract(address)
      ).owners.filter((addr) => addr !== constants.AddressZero);
    }

    const balanceMap = {};
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      let balance = 0;
      if (erc === 'erc1155') {
        balance = await contract.erc1155.balanceOf(address, tokenId);
      } else if (erc === 'erc721') {
        balance = await contract.erc721.balanceOf(address);
      }
      balanceMap[address] = balance.toString();
    }

    setOwners({ owners: addresses, balanceMap });
    setFetchedOwners(true);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setAddress(value);
  };

  const handleTokenIdChange = (event) => {
    const value = event.target.value;
    setTokenId(value);
  };

  const exportToCsv = async () => {
    const filename = 'Snapshot.csv';

    const csvContent = owners.owners
      .map((address) => [address, owners.balanceMap[address]])
      .map((row) => row.map((cell) => (cell == null ? '' : `"${cell.toString()}"`)).join(','))
      .join('\n');

    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = csvUrl;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const loadMoreAddresses = () => {
    setShowMore(true);
  };

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
              type="text"
              placeholder="Enter token address 0x.."
              onChange={handleChange}
              className={styles.inputStyle}
            />

            <h3>Select token type:</h3>
            <select
              value={erc}
              onChange={(event) => setErc(event.target.value)}
              className={styles.chainSelector}
            >
              <option key="erc721" value="erc721">
                ERC721
              </option>
              <option key="erc1155" value="erc1155">
                ERC1155
              </option>
            </select>

            {erc === 'erc1155' && (
              <div>
                <h3>Token ID:</h3>
                <input
                  type="text"
                  value={tokenId}
                  onChange={handleTokenIdChange}
                  className={styles.inputStyle}
                />
              </div>
            )}

            <h3>Select your chain:</h3>
            <select
              value={selectedNetwork}
              onChange={handleNetworkChange}
              className={styles.chainSelector}
            >
              {chainOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className={styles.button}>
              <button className={styles.button} onClick={getList}>
                Get holders
              </button>
            </div>

            {fetchedOwners && (
              <div>
                <div className={styles.button}>
                  <button className={styles.button} onClick={exportToCsv}>
                    Export List as .csv
                  </button>
                </div>

                <div className={styles.previewTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Address</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {owners.owners.map((address) => (
                        <tr key={address}>
                          <td>{address}</td>
                          <td>{owners.balanceMap[address]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!showMore && (
                  <div className={styles.button}>
                    <button className={styles.button} onClick={loadMoreAddresses}>
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Snapshot;
