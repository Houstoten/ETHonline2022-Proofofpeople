import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { BsSunFill, BsMoonFill } from 'react-icons/bs';

import { useTheme as useNextTheme } from 'next-themes'
import { Switch, useTheme, Grid, Card, Row, Button } from '@nextui-org/react'

import { Text } from "@nextui-org/react"
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useAccount, useSigner, useProvider, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { NavBar } from '../components/Navbar';
import { POPbase__factory, POPbase } from '../types/ethers-contracts';

export async function getServerSideProps() {
  const friends = new Array(33).fill({}).map((obj, i) => ({ name: "User" + i, address: "0x" + (Math.random() + 1).toString(36).substring(7) + "..." }))
  return { props: { friends } }
}

const POPbaseAddress = "0xa1a889ed18a9e2aac65b1592b3b16ae3b10d046d"

const Home: NextPage<{ friends: { name: string, address: string }[] }> = ({ friends }) => {
  const { address, isConnecting, isDisconnected } = useAccount()

  // const {data: signer} = useSigner()

  // const provider = useProvider()

  // const {config} = usePrepareContractWrite({
  //   addressOrName: POPbaseAddress,
  //   contractInterface: POPbase__factory.createInterface(),
  //   functionName: "mintAndTransfer",
  //   args: ["0x51349f6D250A50AA73b599EcB953f008BEF4FCbC", "https://gateway.pinata.cloud/ipfs/QmQ2p3sR8n6tPTGEp9isyzz1QTaeYtkPZUFvxGPeLAxY6s"]
  // })

  // const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return (
    <>
      <Head>
        <title>ProofOfPeople - connections list</title>
        <meta name="description" content="ProofOfPeople - connections list" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar/>

      {/* <Button onClick={() => POPbase__factory.connect(POPbaseAddress, signer).mintAndTransfer("0xA8015DF1F65E1f53D491dC1ED35013031AD25034", "https://gateway.pinata.cloud/ipfs/QmbUieYgwpgxs8vyrbAt68GJoa4WX6yP9RdygkCAfzCaFA")}/> */}
      {/* <Button onClick={() => write?.()}/> */}

      <div style={{ display: 'flex', justifyContent: 'center' }}>

        <Grid.Container css={{ width: "50%" }} gap={2} justify="flex-start">
          {friends.map((friend, index) => <Grid key={friend.name} xs={2} sm={3} >
            <Card isPressable >
              <Card.Body css={{ p: 0 }}>
                <Image
                src={`https://avatars.dicebear.com/api/pixel-art/${index}.svg`}
                objectFit="cover"
                height={140}
                width="100%"
                />
              </Card.Body>
              <Card.Footer css={{ justifyItems: "flex-start" }}>
                <Row wrap="wrap" justify="space-between" align="center">
                  <Text b>{friend.name}</Text>
                  <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                    {friend.address}
                  </Text>
                </Row>
              </Card.Footer>
            </Card>
          </Grid>)}
        </Grid.Container>
      </div>
    </>
  )
}

export default Home

// usercontractWithStacking {

//   list invitations

//   function inviteToFriends {
//     add caller address to invitation lis
//   }

//   private function mintToSmb (address) {
//     mint to myself and mint to address
//     remove address from invitations
//   }
// }



// usercontract {

//   list oneTimeCodes
//   list invitations

//   function issueOneTimeCode {
//     create some code and push it to oneTimeCodes list
//   }

//   function inviteToFriends (onetimecode) {
//     if oneTimeCodes has onetimecode
//         add caller address to invitation list
//         delete onetimecode from oneTimeCodes list
//   }

//   private function mintToSmb (address) {
//     mint to myself and mint to address
//     remove address from invitations
//   }
// }