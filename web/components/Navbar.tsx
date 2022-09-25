import { FC, useEffect, useMemo, useState } from 'react';

import { Avatar, Button, Dropdown, Link, Modal, Navbar, Switch, Text, useTheme } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import { ImQrcode } from 'react-icons/im';
import { VscBellDot, VscBell } from 'react-icons/vsc';
import { useTheme as useNextTheme } from 'next-themes'
import { IconButton } from '@mui/material';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useAccount } from 'wagmi';
import { useGetUserTokensQuery } from '../graphqlGenerates';
import { constructFriends } from './ConnectionsGrid';
import Image from 'next/image';

const endpoint = "https://api.thegraph.com/subgraphs/name/houstoten/popgraph"

export const toIpfsLink = (pinataLink: string) => "https://ipfs.io/ipfs/" + pinataLink.split("/")?.at?.(-1)

export const NavBar: FC<{}> = () => {

    const { address, isConnecting, isDisconnected } = useAccount()

    const { setTheme } = useNextTheme()
    const { isDark } = useTheme()

    const [qrModalVisible, setQrModalVisible] = useState(false)
    const [requestsVisible, setRequestsVisible] = useState(false)

    const { data } = useGetUserTokensQuery({ endpoint }, { userId: address?.toLowerCase?.() ?? "" }, { enabled: !!address })

    const { user } = data ?? {};

    //@ts-ignore
    const [connections, requests] = useMemo(() => user && address ? constructFriends(address, user.created, user.tokens) : [[], []], [user, address])

    const [metadata, setMetadata] = useState({})

    useEffect(() => {
        requests.forEach(request => {
            fetch(toIpfsLink(request.metadataURI)).then(response => response.json()).then(resp => setMetadata(metadata => ({ ...metadata, [request.tokenID.toString()]: resp })))
        })
    }, [requests])

    // const _requests = useMemo(async () => await requests.map(async request => {
    //     const meta = await fetch(request.metadataURI).then(response => response.json())
    //     return {...request, ...meta}
    // }), [requests]);

    // console.log({_requests})

    console.log({ metadata })

    return <Navbar variant="sticky">
        <Navbar.Brand>
            <Link href="/">
                <>
                    <Text h6 size={40}>Proof</Text>
                    <Text h6 size={40}>Of</Text>
                    <Text h6 size={40} css={{ textGradient: "45deg, $yellow600 -20%, $pink600 50%", }} weight="bold" >People</Text>
                </>
            </Link>
        </Navbar.Brand>
        <Navbar.Content enableCursorHighlight
            activeColor="secondary"
            hideIn="xs"
            variant="underline">
        </Navbar.Content>
        <Navbar.Content>
            <Navbar.Item>
                <>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <IconButton color="primary">
                                {requests.length ? <VscBellDot size={30} /> : <VscBell size={30} />}
                            </IconButton>
                        </Dropdown.Trigger>
                        <Dropdown.Menu>
                            {/* @ts-ignore */}
                            {requests.map(request => <Dropdown.Item key={request.tokenID} icon={<Avatar size="xs" src={metadata[request.tokenID.toString()]?.image?.includes("pinata") ? toIpfsLink(metadata[request.tokenID.toString()]?.image) : metadata[request.tokenID.toString()]?.image } />}>
                                <Link href={`${process.env.NEXT_PUBLIC_DOMAIN}/invite/${request.creator.id}`}>

                                    {/* @ts-ignore */}
                                    <Text>{metadata[request.tokenID.toString()]?.name}</Text>
                                </Link>
                            </Dropdown.Item>)}
                        </Dropdown.Menu>
                    </Dropdown>
                    <IconButton color="primary" onClick={() => setQrModalVisible(true)}>
                        <ImQrcode size={30} />
                    </IconButton>
                    <Modal open={qrModalVisible} onClose={() => setQrModalVisible(false)}>
                        <Modal.Header>Share with friend</Modal.Header>
                        <Modal.Body>
                            <QRCode width="100%" height="100%" fgColor={isDark ? "white" : "black"} bgColor='transparent' value={`${process.env.NEXT_PUBLIC_DOMAIN}/invite/${address}`} />
                        </Modal.Body>
                    </Modal>
                </>
            </Navbar.Item>
            <Navbar.Item >
                <Switch
                    size="lg"
                    checked={isDark}
                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    iconOn={<BsMoonFill />}
                    iconOff={<BsSunFill />}
                />
            </Navbar.Item>
            <Navbar.Item css={{ width: "max-content" }}>
                <ConnectButton />
            </Navbar.Item>
        </Navbar.Content>
    </Navbar>
}