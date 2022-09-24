import { FC, useState } from 'react';

import { Button, Link, Modal, Navbar, Switch, Text, useTheme } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import { ImQrcode } from 'react-icons/im';
import { useTheme as useNextTheme } from 'next-themes'
import { IconButton } from '@mui/material';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useAccount } from 'wagmi';

export const NavBar: FC<{}> = () => {

    const { address, isConnecting, isDisconnected } = useAccount()

    const { setTheme } = useNextTheme()
    const { isDark } = useTheme()

    const [qrModalVisible, setQrModalVisible] = useState(false)

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
                <IconButton color="primary" onClick={() => setQrModalVisible(true)}>
                    <ImQrcode size={30}/>
                </IconButton>
                <Modal open={qrModalVisible} onClose={() => setQrModalVisible(false)}>
                    <Modal.Header>Share with friend</Modal.Header>
                    <Modal.Body>
                            <QRCode width="100%" height="100%" fgColor={isDark ? "white" : "black"} bgColor='transparent' value={`http://localhost:3000/invite/${address}`} />
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