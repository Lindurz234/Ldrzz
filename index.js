import { useState, useEffect } from 'react';
import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import AirdropClaim from '../components/AirdropClaim';

export default function Home() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Head>
        <title>Splash Airdrop - Claim Your Rewards</title>
        <meta name="description" content="Decentralized Airdrop Platform" />
      </Head>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute animate-float" 
                 style={{
                   top: `${Math.random() * 100}%`,
                   left: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 6}s`
                 }}>
              <div className="w-4 h-4 bg-white rounded-full opacity-30"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
            <h1 className="text-3xl font-bold text-white">Splash Airdrop</h1>
          </div>
          <WalletConnect 
            onConnect={(acc, net) => {
              setAccount(acc);
              setIsConnected(true);
              setNetwork(net);
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center mt-20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-6xl font-bold text-white mb-6 animate-pulse">
                🎁 Claim Your Airdrop!
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Connect your wallet to claim your exclusive airdrop rewards. 
                Secure, transparent, and instant!
              </p>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl mb-4">⚡</div>
                  <h3 className="text-white font-semibold mb-2">Instant Claim</h3>
                  <p className="text-gray-300">Get your tokens immediately after verification</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl mb-4">🔒</div>
                  <h3 className="text-white font-semibold mb-2">Secure</h3>
                  <p className="text-gray-300">Your funds are safe with our smart contracts</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl mb-4">🌐</div>
                  <h3 className="text-white font-semibold mb-2">Multi-Chain</h3>
                  <p className="text-gray-300">Supporting all EVM-compatible networks</p>
                </div>
              </div>

              <div className="animate-bounce mt-8">
                <div className="text-white text-lg font-semibold">
                  👇 Connect Wallet to Start ↓
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AirdropClaim account={account} network={network} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6 text-gray-400">
        <p>© 2024 Splash Airdrop. All rights reserved. Built with ❤️ for the Web3 community.</p>
      </footer>
    </div>
  );
}