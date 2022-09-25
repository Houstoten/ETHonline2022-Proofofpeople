import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { BsSunFill, BsMoonFill } from 'react-icons/bs';

import { useTheme as useNextTheme } from 'next-themes'
import { Switch, useTheme, Grid, Card, Row, Button } from '@nextui-org/react'

import { Text } from "@nextui-org/react"
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useAccount, useSigner, useProvider, useContractWrite, usePrepareContractWrite, useEnsAvatar } from 'wagmi'
import { NavBar } from '../components/Navbar';
import { POPbase__factory, POPbase } from '../types/ethers-contracts';
import { useGetUserTokensQuery } from '../graphqlGenerates';
import { ConnectionsGrid, constructFriends, Friends, UserCardModalBody } from '../components/ConnectionsGrid';
import * as R from 'ramda'
import { useMemo } from 'react';

import dynamic from 'next/dynamic'
const QRCode = dynamic(() => import('qrcode.react').then(imp => imp.QRCodeSVG), { ssr: false })

export async function getServerSideProps() {
  const friends = new Array(33).fill({}).map((obj, i) => ({ name: "User" + i, address: "0x" + (Math.random() + 1).toString(36).substring(7) + "..." }))
  return { props: { friends } }
}

const POPbaseAddress = "0xa1a889ed18a9e2aac65b1592b3b16ae3b10d046d"

const endpoint = "https://api.thegraph.com/subgraphs/name/houstoten/popgraph"

const Home: NextPage<{}> = () => {
  const { address, isConnecting, isDisconnected } = useAccount()

  const { isDark } = useTheme()

  const { data } = useGetUserTokensQuery({ endpoint }, { userId: address?.toLowerCase?.() ?? "" }, { enabled: !!address })

  const { user } = data ?? {};

  //@ts-ignore
  const [friends, requests] = useMemo(() => user && address ? constructFriends(address, user.created, user.tokens) : [[], []], [user, address])

  const _friends: Friends = R.reduce((acc, connection) => ({ ...acc, [connection.friend.id]: [...(acc[connection.friend.id] ?? []), connection] }), {}, friends)

  const { data: avatarData } = useEnsAvatar({ addressOrName: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", chainId: 1 });

  return (
    <>
      <Head>
        <title>ProofOfPeople - connections list</title>
        <meta name="description" content="ProofOfPeople - connections list" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      {/* {address ? (() => {
        const {data} = useGetUserTokensQuery({endpoint: "https://api.thegraph.com/subgraphs/name/houstoten/popgraph"}, {userId: address.toLowerCase()})

        console.log({data})
        return null;
      })() : null} */}

      {/* <Button onClick={() => POPbase__factory.connect(POPbaseAddress, signer).mintAndTransfer("0xA8015DF1F65E1f53D491dC1ED35013031AD25034", "https://gateway.pinata.cloud/ipfs/QmbUieYgwpgxs8vyrbAt68GJoa4WX6yP9RdygkCAfzCaFA")}/> */}
      {/* <Button onClick={() => write?.()}/> */}

      <div style={{ display: 'flex', justifyContent: 'center', height: 'calc(100vh - 76px)', alignItems: 'center' }}>

        {address ? Object.entries(_friends).length ?
          <ConnectionsGrid address={address} />
          : <div style={{ height: "70%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex' }}>
              <Text h2>Show this QR-code to your friend to "</Text>
              <Text h2 css={{ textGradient: "45deg, $yellow600 -20%, $pink600 50%", }}>mint-a-moment</Text>
              <Text h2>" 🌈</Text>

            </div>
            {address && <QRCode width="100%" height="100%" fgColor={isDark ? "white" : "black"} bgColor='transparent' value={`${process.env.NEXT_PUBLIC_DOMAIN}/invite/${address}`} />}

            <Text h3>Or scan theirs 📷</Text>
          </div> :
          <Grid.Container css={{ width: '70%', height: '100%' }}>
            <Grid xs={6} css={{alignItems: 'center'}}>
              <Card isHoverable variant='bordered' css={{height: '300px'}}>
                <Card.Body css={{ padding: '0 20px', overflow: 'hidden' }}>
                  <UserCardModalBody address={"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"} fullName="Vitalik Buterin" description="Try this app out. It's LIIIT 🔥" connections={[
                    {
                      "friend": {
                        "id": "0x51349f6d250a50aa73b599ecb953f008bef4fcbc"
                      },
                      "connectionNFTs": [
                        {
                          "tokenID": BigInt(1),
                          "createdAtTimestamp": "1663878496",
                          "name": "A friend of User1",
                          "description": "I'm glad you to be my friend, User2",
                          "image": "https://en.wikipedia.org/wiki/Wave_(gesture)#/media/File:383-waving-hand-1.svg",
                          "metadataURI": "https://gateway.pinata.cloud/ipfs/QmbUieYgwpgxs8vyrbAt68GJoa4WX6yP9RdygkCAfzCaFA",
                          "creator": {
                            "id": "0x51349f6d250a50aa73b599ecb953f008bef4fcbc"
                          }
                        },
                        {
                          "tokenID": BigInt(2),
                          "createdAtTimestamp": "1663878737",
                          "name": "A friend of User2",
                          "description": "I'm happy to see you as my friend, User1",
                          "image": "https://cdn-icons-png.flaticon.com/512/2949/2949755.png",
                          "metadataURI": "https://gateway.pinata.cloud/ipfs/QmQ2p3sR8n6tPTGEp9isyzz1QTaeYtkPZUFvxGPeLAxY6s",
                          "owner": {
                            "id": "0x51349f6d250a50aa73b599ecb953f008bef4fcbc"
                          }
                        }
                      ]
                    },
                    {
                      "friend": {
                        "id": "0x51349f6d250a50aa73b599ecb953f008bef4fcbc"
                      },
                      "connectionNFTs": [
                        {
                          "tokenID": BigInt(3),
                          "createdAtTimestamp": "1664067076",
                          "name": "Real friendship request",
                          "description": "Hey! We met today at the Hall and had small talk",
                          "image": "https://gateway.pinata.cloud/ipfs/QmZFqqCpzHUzVoYT73Ggy4RsEsNf4rmdzQHceTgmf4qJQ3",
                          "metadataURI": "https://gateway.pinata.cloud/ipfs/QmU7TaiMxk6syPXd16QMBDSiHTDeWvN5GSMNX6WjLzQZ56",
                          "creator": {
                            "id": "0x51349f6d250a50aa73b599ecb953f008bef4fcbc"
                          }
                        },
                        {
                          "tokenID": BigInt(4),
                          "createdAtTimestamp": "1664067176",
                          "name": "Hall meeting connection",
                          "description": "Hi, I remember we met!",
                          "image": "https://gateway.pinata.cloud/ipfs/QmTgx5jNGLBDeuVcRmqqzFeW2K8h964AhJ9GKHoUnx4qKJ",
                          "metadataURI": "https://gateway.pinata.cloud/ipfs/QmRP5WXfmzBkWesRcGxmjNRoa9mucwhVB7JvffZutQypYz",
                          "owner": {
                            "id": "0x51349f6d250a50aa73b599ecb953f008bef4fcbc"
                          }
                        }
                      ]
                    },
                  ]} avatarData={avatarData?.toString() ?? null} />
                </Card.Body>
              </Card>
            </Grid>
            <Grid xs={6} css={{alignItems: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', textAlign: 'end', width: '100%'}}>
                <Text h1>Are you ready to</Text>
                <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $pink600 50%", }}>Mint-a-Moment</Text>
                <Text h1>?</Text>
              </div>
            </Grid>
          </Grid.Container>
        }
        {/* <ConnectionsGrid address={address} /> */}

        {/* <Grid.Container css={{ width: "50%" }} gap={2} justify="flex-start">
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
        </Grid.Container> */}
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