import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect, metaMask } from 'wagmi/connectors'

// 1. Get projectId at https://cloud.walletconnect.com
// const projectId = 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [base],
  connectors: [
    // injected(),
    metaMask(),
    // walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http(),
  },
})
