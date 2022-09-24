import type { NextPage } from 'next'
import Head from 'next/head'

import { Avatar, Button, Card, Grid, Input, Text, Textarea, useTheme } from "@nextui-org/react"

import { useAccount, useEnsAvatar } from 'wagmi'
import { NavBar } from '../../components/Navbar';

import { useRouter } from 'next/router'

import { isAddress } from 'ethers/lib/utils';
import { useDropzone } from "react-dropzone";

import dynamic from 'next/dynamic'

const QRCode = dynamic(() => import('qrcode.react').then(imp => imp.QRCodeSVG), {ssr: false})

// import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';

const Home: NextPage<{}> = () => {
    const { address, isConnecting, isDisconnected } = useAccount()

    const { isDark } = useTheme()

    const router = useRouter()

    const { uid } = router.query

    const { data: avatarData } = useEnsAvatar({ addressOrName: uid?.toString(), chainId: 1 });

    const [imagePath, setPath] = useState<string>()

    const nameInputRef = useRef(null)

    const descriptionInputRef = useRef(null)

    const onDrop = useCallback((acceptedFiles: any) => {
        setPath(URL.createObjectURL(acceptedFiles[0]))
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/png': ['.png', '.jpg'] }, maxFiles: 1 });

    //TODO create form for user data minting

    // console.log({ isValid: isAddress(uid?.toString()?.toLowerCase() ?? '') })

    return (
        <>
            <Head>
                <title>ProofOfPeople - connections list</title>
                <meta name="description" content="ProofOfPeople - connections list" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBar />

            <div style={{ height: 'calc(100vh - 76px)', width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <Grid.Container gap={2}>
                    <Grid xs={6}>
                        <div style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', justifyContent: "center" }}>
                            {/* <QRCode width="100%" height="100%" fgColor={isDark ? "white" : "black"} bgColor='transparent' value={`http://localhost:3000/invite/${address}`} /> */}
                            {/* <Text css={{textAlign: 'center'}}>This QRCode represents YOUR account! Let your friend scan it!</Text> */}
                            <div style={{ width: "50%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', justifyContent: "center" }}>

                                <div style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                                    <Avatar bordered src={avatarData ?? `https://avatars.dicebear.com/api/pixel-art/${uid}.svg` } />
                                    <Text>{uid}</Text>
                                </div>
                                <Input ref={nameInputRef} placeholder="Friendship request title..." width='100%' />
                                <Textarea ref={descriptionInputRef} placeholder="Friendship request description..." width="100%" />
                                <Card isPressable css={{ height: '150px', width: '100%' }}>
                                    <Card.Body css={{ padding: 0 }}>
                                        <div style={{ width: "100%", height: '100%', zIndex: 10 }} {...getRootProps()}>
                                            <input {...getInputProps()} />
                                        </div>
                                        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {imagePath ? <Image src={imagePath} height="100px" width="100px" /> : <Text css={{ lineHeight: '10px' }}>Drop request image here</Text>}
                                        </div>
                                    </Card.Body>
                                </Card>
                                <Button css={{width: '100%'}}>Send friendship request</Button>
                            </div>
                        </div>
                    </Grid>
                    <Grid xs={6} css={{ alignItems: 'center' }}>
                        <div style={{ width: "100%", height: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            {address && <QRCode width="100%" height="100%" fgColor={isDark ? "white" : "black"} bgColor='transparent' value={`http://localhost:3000/invite/${address}`} />}
                            <Text css={{ textAlign: 'center' }}>This QRCode represents YOUR account! Let your friend scan it!</Text>
                        </div>
                    </Grid>
                </Grid.Container>
            </div>
        </>
    )
}

export default Home
