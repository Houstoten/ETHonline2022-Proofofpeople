import { FC } from 'react';

import { Navbar, Switch, Text, useTheme } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import { useTheme as useNextTheme } from 'next-themes'

export const NavBar: FC<{}> = () => {

    const { setTheme } = useNextTheme()
    const { isDark } = useTheme()

    return <Navbar variant="sticky">
        <Navbar.Brand>
            <Text h6 size={40}>Proof</Text>
            <Text h6 size={40}>Of</Text>
            <Text h6 size={40} css={{ textGradient: "45deg, $yellow600 -20%, $pink600 50%", }} weight="bold" >People</Text>
        </Navbar.Brand>
        <Navbar.Content enableCursorHighlight
            activeColor="secondary"
            hideIn="xs"
            variant="underline">

            <Navbar.Link href="/profile">Profile</Navbar.Link>
            <Navbar.Link href="/">Connections</Navbar.Link>

        </Navbar.Content>
        <Navbar.Content>
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