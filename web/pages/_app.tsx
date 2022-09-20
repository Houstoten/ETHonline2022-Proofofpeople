import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// import { SessionProvider } from "next-auth/react"

import '@rainbow-me/rainbowkit/styles.css';

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  wallet,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.polygonMumbai,
    // chain.mainnet,
    // chain.polygon,
    // chain.optimism,
    // chain.arbitrum,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
    //   ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
    //   : []),
  ],
  [
    alchemyProvider({ apiKey: 'cfOcLrmKwGl_erme493V8KWPArB6vwUE' }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
});

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      wallet.argent({ chains }),
      wallet.trust({ chains }),
      wallet.ledger({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const lightTheme = createTheme({
  type: 'light',
  theme: {
    // colors: {...}
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    // colors: {...}
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return <NextThemesProvider
    defaultTheme="system"
    attribute="class"
    value={{
      light: lightTheme.className,
      dark: darkTheme.className
    }}
  >
    <NextUIProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>

          {/* @ts-ignore */}
          {/* <SessionProvider session={pageProps.session} refetchInterval={0}> */}

          <Component {...pageProps} />
          {/* </SessionProvider> */}

        </RainbowKitProvider>
      </WagmiConfig>
    </NextUIProvider>
  </NextThemesProvider>
}

export default MyApp
