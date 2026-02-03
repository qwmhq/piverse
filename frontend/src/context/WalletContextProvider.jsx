import { WagmiProvider } from 'wagmi'
import { config } from '../config/wagmi'

export const WalletContextProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  )
}
