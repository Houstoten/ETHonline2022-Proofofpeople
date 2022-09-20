import type { NextPage } from 'next'
import Head from 'next/head'

import { Grid, Input, Text } from "@nextui-org/react"

import { useAccount } from 'wagmi'
import { NavBar } from '../../components/Navbar';

export async function getServerSideProps() {
    const friends = new Array(33).fill({}).map((obj, i) => ({ name: "User" + i, address: "0x" + (Math.random() + 1).toString(36).substring(7) + "..." }))
    return { props: { friends } }
}

const Home: NextPage<{ friends: { name: string, address: string }[] }> = ({ friends }) => {
    const { address, isConnecting, isDisconnected } = useAccount()

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
