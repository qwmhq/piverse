import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import HowToPlayModal from "../components/HowToPlayModal";

export default function AccessPage({ onEnter }) {
  const { isConnected, address } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [typedStatus, setTypedStatus] = useState("");
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  // Simple typing effect for the status log
  useEffect(() => {
    const text = isConnected
      ? "> IDENTITY VERIFIED. ACCESS GRANTED."
      : "> WAITING FOR WALLET CONNECTION...";

    setTypedStatus("");
    let i = 0;
    const interval = setInterval(() => {
      setTypedStatus(() => text.substring(0, i + 1));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Log connection errors
  useEffect(() => {
    if (error) {
      console.error("Wallet connection error:", error);
    }
  }, [error]);

  const handleConnectClick = () => {
    if (!isConnected) {
      setShowWalletSelector(true);
    } else {
      // Handle entering the game - for now just log
      console.log("Entering system...");
    }
  };

  const handleWalletSelect = (connector) => {
    connect({ connector });
    setShowWalletSelector(false);
  };

  return (
    <div className="bg-brand-dark min-h-screen flex items-center justify-center p-2 sm:p-4 selection:bg-brand-red selection:text-white overflow-hidden relative font-orbitron">
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121118] border border-white/10 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowWalletSelector(false)}
              className="absolute top-3 right-3 text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-red">account_balance_wallet</span>
                SELECT UPLINK
              </h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-200 text-xs font-mono break-words">
                  ERROR: {error.message}
                </div>
              )}

              <div className="flex flex-col gap-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    disabled={isPending}
                    onClick={() => handleWalletSelect(connector)}
                    className="flex items-center justify-between p-4 rounded-lg bg-[#1c1929] hover:bg-[#2b2839] border border-white/5 hover:border-brand-red/50 transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-gray-200 font-mono font-bold group-hover:text-white transition-colors">
                      {connector.name}
                    </span>
                    {isPending ? (
                      <span className="material-symbols-outlined animate-spin text-brand-red">
                        refresh
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-gray-500 group-hover:text-brand-red transition-colors">
                        arrow_forward_ios
                      </span>
                    )}
                  </button>
                ))}
            </div>
            </div>
            <div className="bg-brand-red/5 p-4 border-t border-white/5 text-[10px] text-center text-white/40 font-mono">
              SECURE CONNECTION REQUIRED FOR ACCESS
            </div>
          </div>
        </div>
      )}

      {/* Background texture/grid effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(#D30000_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>

      {/* Main Terminal Container */}
      <div className="relative w-full max-w-[800px] flex flex-col bg-brand-gray border border-white/10 rounded-xl shadow-neon-red overflow-hidden z-10 backdrop-blur-sm">
        {/* Header / Status Bar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 bg-brand-dark px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <div className="size-5 sm:size-6 flex items-center justify-center">
              <img
                src="/assets/hero.png"
                alt="ClawVerse Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h2 className="text-white text-xs sm:text-sm font-bold tracking-[0.1em] font-mono">
              // CLAWVERSE ACCESS TERMINAL
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="relative overflow-hidden group bg-brand-red hover:bg-brand-red/90 text-white border border-white/20 hover:border-white/50 px-4 py-1.5 rounded text-[10px] sm:text-xs font-bold tracking-wider transition-all shadow-neon-red"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer pointer-events-none"></span>
              <span className="relative z-10">[ PROTOCOL ]</span>
            </button>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-brand-red"
                } animate-pulse`}
              ></div>
              <span className="text-white/60 text-[10px] sm:text-xs font-bold tracking-widest hidden sm:inline font-mono">
                NET: {isConnected ? "SECURE" : "UNVERIFIED"}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-col p-4 sm:p-10 min-h-[400px] sm:min-h-[500px]">
          {/* Hero Section */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/assets/crab-brain.png" 
              alt="ClawVerse AI" 
              className="w-48 h-48 object-cover rounded-2xl border-2 border-brand-red shadow-neon-red mb-6"
            />
            <div className="text-center">
              <h1 className="text-white text-4xl sm:text-6xl font-black leading-tight mb-2 tracking-tighter text-brand-red shadow-neon-red">
                CLAWVERSE
              </h1>
              <p className="text-brand-blue text-xs sm:text-sm font-bold tracking-widest uppercase font-mono">
                <span className="material-symbols-outlined align-bottom text-sm mr-1">
                  terminal
                </span>
                The Crab is the Gatekeeper. Persuasion is your weapon.
              </p>
            </div>
          </div>

          {/* Socials & Contract Info */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 sm:mb-8 font-mono text-xs sm:text-sm">
            <a
              href="https://x.com/clawdotverse"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-dark text-white px-3 py-2 rounded border border-white/10 hover:border-brand-red hover:bg-brand-red/5 hover:text-brand-red transition-all duration-300 group"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <span className="font-bold tracking-wide">@clawdotverse</span>
            </a>

            <div
              className="flex items-center gap-2 bg-brand-dark text-white/60 px-3 py-2 rounded border border-brand-blue/30 cursor-pointer hover:bg-brand-gray transition-colors group relative"
              onClick={() => {
                navigator.clipboard.writeText(
                  "CLAW_VERSE_CONTRACT_ADDRESS"
                );
              }}
            >
              <span className="material-symbols-outlined text-sm text-brand-blue">
                token
              </span>
              <span className="font-mono text-xs sm:text-sm">
                CA:{" "}
                <span className="text-white font-bold ml-1 tracking-wide group-hover:text-brand-blue transition-colors">
                  Coming soon
                </span>
              </span>
            </div>
          </div>

          {/* Terminal Output Simulation */}
          <div className="flex flex-col gap-1 mb-6 sm:mb-8 font-mono text-xs sm:text-sm text-brand-blue/80 p-3 sm:p-4 rounded-lg bg-black/40 border border-white/5 h-24 sm:h-32 overflow-hidden shadow-inner">
            <p className="opacity-60">&gt; NEURAL LINK ESTABLISHED...</p>
            <p className="opacity-80">&gt; BYPASSING FIREWALL... [SUCCESS]</p>
            <p className="opacity-80">&gt; SCANNING FOR CLAW SIGNATURES...</p>
            <p className="text-brand-red animate-pulse">{typedStatus}</p>
          </div>

          {/* Login / Connect Action */}
          <div className="flex flex-col gap-4 sm:gap-6 max-w-lg w-full mx-auto">
            {isConnected && (
              <div className="group relative">
                <div className="absolute inset-0 bg-brand-red/5 rounded-lg -z-10"></div>
                <div className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-white/10 bg-brand-dark">
                  <span className="text-brand-red font-bold text-base sm:text-lg mr-2 sm:mr-3 select-none whitespace-nowrap font-mono">
                    AUTH &gt;
                  </span>
                  <span className="text-white font-mono text-sm sm:text-base tracking-wider truncate">
                    {address?.toString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 mt-2">
              <button
                onClick={() => {
                  if (isConnected) {
                    onEnter();
                  } else {
                    handleConnectClick();
                  }
                }}
                className="disabled:opacity-50 disabled:pointer-events-none relative w-full sm:flex-1 group overflow-hidden rounded-lg bg-brand-red hover:bg-brand-red/80 transition-all h-14 flex items-center justify-center text-white font-black tracking-widest border border-white/10 shadow-neon-red text-sm sm:text-lg"
              >
                {isConnected ? "[ ENTER CLAWVERSE ]" : "[ SYNC NEURAL LINK ]"}
              </button>
            </div>
            
            {isConnected && (
              <button
                onClick={() => disconnect()}
                className="text-red-500 hover:text-red-400 text-xs font-bold tracking-widest transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                DISCONNECT UPLINK
              </button>
            )}
          </div>
        </div>

        {/* Footer / System Status */}
        <div className="bg-brand-dark border-t border-white/10 px-4 sm:px-6 py-3 flex justify-between items-center text-[10px] sm:text-xs text-white/40 font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-brand-red">
              memory
            </span>
            <span>CLAW_SYNC: ACTIVE</span>
          </div>
          <div className="uppercase tracking-wider text-brand-blue animate-pulse">
            STATUS: {isConnected ? "READY" : "AWAITING NEURAL LINK"}
          </div>
        </div>
      </div>
    </div>
  );
}
