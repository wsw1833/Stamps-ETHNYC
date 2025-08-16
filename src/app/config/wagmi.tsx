import { createConfig } from 'wagmi';
import { http } from 'viem';
import { flowTestnet } from 'viem/chains';

export const config = createConfig({
  chains: [flowTestnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [flowTestnet.id]: http(),
  },
});
