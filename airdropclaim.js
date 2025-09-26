import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function AirdropClaim({ account, network }) {
  const [isEligible, setIsEligible] = useState(false);
  const [airdropAmount, setAirdropAmount] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // Simulasi cek eligibility
  useEffect(() => {
    const checkEligibility = async () => {
      // Simulasi delay network
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random eligibility untuk demo
      const eligible = Math.random() > 0.3;
      setIsEligible(eligible);
      
      if (eligible) {
        setAirdropAmount((Math.random() * 1000 + 100).toFixed(2));
      }
    };

    checkEligibility();
  }, [account]);

  const claimAirdrop = async () => {
    setIsClaiming(true);
    
    try {
      // Simulasi proses claim
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Di sini akan ada interaksi dengan smart contract sebenarnya
      console.log('Claiming airdrop for:', account);
      
      setClaimed(true);
    } catch (error) {
      console.error('Error claiming airdrop:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isEligible) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-8 mb-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-white mb-2">Not Eligible</h2>
          <p className="text-gray-300">
            Your wallet is not eligible for this airdrop. Please check our next campaigns!
          </p>
        </div>
      </div>
    );
  }

  if (claimed) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-500/20 border border-green-500 rounded-xl p-8 mb-6 animate-pulse">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-gray-300 mb-4">
            You have successfully claimed {airdropAmount} tokens!
          </p>
          <div className="text-sm text-gray-400">
            Transaction confirmed on {network}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500 rounded-xl p-8 mb-6 backdrop-blur-lg">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-3xl font-bold text-white mb-2">Airdrop Available!</h2>
          <p className="text-gray-300">You're eligible to claim your airdrop rewards</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-cyan-400 font-semibold">Airdrop Amount</div>
            <div className="text-2xl font-bold text-white">{airdropAmount} Tokens</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="text-cyan-400 font-semibold">Network</div>
            <div className="text-xl font-bold text-white">{network}</div>
          </div>
        </div>

        <button
          onClick={claimAirdrop}
          disabled={isClaiming}
          className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClaiming ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              Claiming Airdrop...
            </div>
          ) : (
            '🚀 Claim My Airdrop Now!'
          )}
        </button>

        {/* Disclaimer Transparan */}
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-200 text-center">
            🔒 Secure Transaction: You will approve this transaction in your wallet. 
            No hidden fees or unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
}