import { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    }
  }
};

let web3Modal;

if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions,
    theme: 'dark'
  });
}

export default function WalletConnect({ onConnect }) {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(instance);
      
      // Subscribe to accounts change
      instance.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        onConnect(accounts[0], network);
      });

      // Subscribe to chainId change
      instance.on('chainChanged', (chainId) => {
        const networkName = getNetworkName(parseInt(chainId));
        setNetwork(networkName);
        onConnect(account, networkName);
      });

      const accounts = await web3Provider.listAccounts();
      const network = await web3Provider.getNetwork();
      const networkName = getNetworkName(network.chainId);

      setProvider(web3Provider);
      setAccount(accounts[0]);
      setNetwork(networkName);
      onConnect(accounts[0], networkName);

    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum',
      56: 'BSC',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism',
      43114: 'Avalanche'
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      connectWallet();
    }
  }, []);

  return (
    <div>
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🎁 Claim Airdrop - Connect Wallet
        </button>
      ) : (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="text-sm text-white">
            <div>Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>
            <div className="text-cyan-300">Network: {network}</div>
          </div>
        </div>
      )}
    </div>
  );
}