'use client';

import {
  DynamicContextProvider,
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { FlowWalletConnectors } from '@dynamic-labs/flow';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/wagmi';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface WalletWatcherProps {
  children: ReactNode;
}

function WalletWatcher({ children }: WalletWatcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // If user is not connected and is trying to access a page other than root
    if (!isConnected && pathname !== '/') {
      disconnect();
      router.push('/');
    }
  }, [isConnected, pathname, disconnect, router]);

  return <>{children}</>;
}

export default function WalletProvider({ children }: WalletWatcherProps) {
  const queryClient = new QueryClient();
  return (
    <DynamicContextProvider
      settings={{
        environmentId: '76d52ec1-bc21-461a-acc3-a9f94961cf16',
        walletConnectors: [EthereumWalletConnectors, FlowWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <WalletWatcher>{children}</WalletWatcher>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
