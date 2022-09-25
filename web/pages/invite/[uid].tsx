import type { NextPage } from 'next'
import Head from 'next/head'

import { Avatar, Button, Card, Grid, Input, Text, Textarea, useTheme } from "@nextui-org/react"

import { useAccount, useContractWrite, useEnsAvatar, usePrepareContractWrite } from 'wagmi'
import { NavBar } from '../../components/Navbar';

import { useRouter } from 'next/router'

import { isAddress } from 'ethers/lib/utils';
import { useDropzone } from "react-dropzone";

import dynamic from 'next/dynamic'
// import pinataClient from '@pinata/sdk';
import axios from 'axios'

const QRCode = dynamic(() => import('qrcode.react').then(imp => imp.QRCodeSVG), { ssr: false })

// import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { POPbase__factory } from '../../types/ethers-contracts';

// const pinata = pinataClient(process.env.PINATA_API_KEY || "", process.env.PINATA_API_KEY_SECRET || "")

const sendFileToIPFS = async (file: any) => {

    if (file) {
        try {

            const formData = new FormData();
            formData.append("file", file);

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
                    'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY_SECRET}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            return ImgHash
            //Take a look at your Pinata Pinned section, you will see a new file added to you list.   



        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    }
}

const sendJsonToIPFS = async (json: {}) => {

    const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: JSON.stringify(json),
        headers: {
            'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY_SECRET}`,
            "Content-Type": "application/json"
        },
    });

    const objURL = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
    return objURL

}

const POPbaseAddress = "0xa1a889ed18a9e2aac65b1592b3b16ae3b10d046d"

const Home: NextPage<{}> = () => {
    const { address, isConnecting, isDisconnected } = useAccount()

    const { isDark } = useTheme()

    const router = useRouter()

//   const {config} = usePrepareContractWrite({
//     mode: "recklesslyUnprepared",
//     addressOrName: POPbaseAddress,
//     contractInterface: POPbase__factory.createInterface(),
//     functionName: "mintAndTransfer",
//     // args: ["0x51349f6D250A50AA73b599EcB953f008BEF4FCbC", "https://gateway.pinata.cloud/ipfs/QmQ2p3sR8n6tPTGEp9isyzz1QTaeYtkPZUFvxGPeLAxY6s"]
//   })

  const { data, isLoading, isSuccess, write } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: POPbaseAddress,
    contractInterface: POPbase__factory.createInterface(),
    functionName: "mintAndTransfer",
    // args: ["0x51349f6D250A50AA73b599EcB953f008BEF4FCbC", "https://gateway.pinata.cloud/ipfs/QmQ2p3sR8n6tPTGEp9isyzz1QTaeYtkPZUFvxGPeLAxY6s"]
  })

    const { uid } = router.query

    const { data: avatarData } = useEnsAvatar({ addressOrName: uid?.toString(), chainId: 1 });

    const [imagePath, setPath] = useState<string>()

    const [file, setFile] = useState<any>()

    const nameInputRef = useRef(null)

    const descriptionInputRef = useRef(null)

    const onDrop = useCallback((acceptedFiles: any) => {
        setFile(acceptedFiles[0])
        setPath(URL.createObjectURL(acceptedFiles[0]))
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/png': ['.png', '.jpg'] }, maxFiles: 1 });

    // console.log({ isValid: isAddress(uid?.toString()?.toLowerCase() ?? '') })

    const [loading, setLoading] = useState(false)

    const onPublishClick = async () => {
        setLoading(true)

        const ipfsImage = await sendFileToIPFS(file)

        //@ts-ignore
        const objUrl = await sendJsonToIPFS({ name: nameInputRef.current?.value ?? "Friendship request", description: descriptionInputRef.current?.value, image: ipfsImage })

        await write?.({recklesslySetUnpreparedArgs: [uid, objUrl]})

        setLoading(false)
    }


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
                            <div style={{ width: "50%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', justifyContent: "center" }}>

                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                    <Avatar bordered src={avatarData ?? `https://avatars.dicebear.com/api/pixel-art/${uid}.svg`} />
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
                                <Button onClick={onPublishClick} disabled={loading} css={{ width: '100%' }}>Send friendship request</Button>
                            </div>
                        </div>
                    </Grid>
                    <Grid xs={6} css={{ alignItems: 'center' }}>
                        <div style={{ width: "100%", height: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            {address && <QRCode width="100%" height="100%" fgColor={isDark ? "white" : "black"} bgColor='transparent' value={`${process.env.NEXT_PUBLIC_DOMAIN}/invite/${address}`} />}
                            <Text css={{ textAlign: 'center' }}>This QRCode represents YOUR account! Let your friend scan it!</Text>
                        </div>
                    </Grid>
                </Grid.Container>
            </div>
        </>
    )
}

export default Home
