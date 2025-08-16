import { createConfig } from 'wagmi';
import { http } from 'viem';
import { flowTestnet, sepolia } from 'viem/chains';

export const config = createConfig({
  chains: [sepolia, flowTestnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(),
    [flowTestnet.id]: http(),
  },
});
