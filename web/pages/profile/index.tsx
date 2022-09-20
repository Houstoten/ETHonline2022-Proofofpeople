import type { NextPage } from 'next'
import Head from 'next/head'

import { Grid, Input, Text } from "@nextui-org/react"

import { useAccount } from 'wagmi'
import { NavBar } from '../../components/Navbar';

const Home: NextPage<{}> = () => {
    const { address, isConnecting, isDisconnected } = useAccount()

    //TODO create form for user data minting

    return (
        <>
            <Head>
                <title>ProofOfPeople - connections list</title>
                <meta name="description" content="ProofOfPeople - connections list" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBar />

            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center' }}>

<div >
                        <Input
                            placeholder="Default"
                            status="default"
                        />
                        <Input
                            placeholder="Default"
                            status="default"
                        />
                        <Input
                            placeholder="Default"
                            status="default"
                        />
</div>
            </div>
        </>
    )
}

export default Home
