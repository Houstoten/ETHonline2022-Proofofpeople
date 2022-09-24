import { Avatar, Card, Grid, Row, Text, Modal } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { useGetUserTokensQuery } from "../graphqlGenerates";
import * as R from 'ramda'
import { useEnsAvatar } from 'wagmi'
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab'

const endpoint = "https://api.thegraph.com/subgraphs/name/houstoten/popgraph"

type ConnectionNFTs = [
    {
        tokenID: BigInt,
        name?: string,
        description?: string,
        image?: string,
        createdAtTimestamp: string,
        metadataURI: string,
        creator: { id: string }
    },
    {
        tokenID: BigInt,
        name?: string,
        description?: string,
        image?: string,
        createdAtTimestamp: string,
        metadataURI: string,
        owner: { id: string }
    }
]

type ConstructFriends = (
    address: string,
    created: Array<{ tokenID: BigInt, metadataURI: string, owner: { id: string } }>,
    tokens: Array<{ tokenID: BigInt, metadataURI: string, creator: { id: string } }>
) => [
        Array<{
            connectionNFTs: ConnectionNFTs,
            friend: { id: string }
        }>,
        Array<{ tokenID: BigInt, metadataURI: string, creator: { id: string } }>
    ]

interface Connection {
    connectionNFTs: ConnectionNFTs,
    friend: { id: string }
}

interface Friends {
    [key: string]: Array<Connection>
}

const constructFriends: ConstructFriends = (address, created, tokens) => {

    if (!created.length || !tokens.length) {
        return [[], tokens]
    }

    const idx = tokens.findIndex(({ creator: { id } }) => created[0].owner.id === id)

    if (idx > -1) {

        const myToken = tokens[idx]

        const theirsToken = created[0]

        const [_friends, _requests] = constructFriends(address, R.remove(0, 1, created), R.remove(idx, 1, tokens))

        return [[{ friend: myToken.creator, connectionNFTs: [myToken, theirsToken] }, ..._friends], _requests]
    }

    const [_friends, _requests] = constructFriends(address, R.remove(0, 1, created), tokens)

    return [_friends, _requests];
}

const addressEllipsis = (address: string) => address.length ? R.slice(0, 10, address) + "..." + R.slice(-6, -1, address) : address;

const fixIMGForDemo: (img: string) => string = img => {
    if (img === "https://en.wikipedia.org/wiki/Wave_(gesture)#/media/File:383-waving-hand-1.svg") {
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/383-waving-hand-1.svg/1024px-383-waving-hand-1.svg.png"
    }

    return img
}

const UserCard: FC<{ address: string, connections: Array<Connection> }> = ({ address, connections }) => {

    const { data: avatarData } = useEnsAvatar({ addressOrName: address, chainId: 1 });

    const [modalVisible, setModalVisible] = useState(false)

    const mockConnections = [...connections, ...connections, ...connections, ...connections]

    return <Grid key={address} xs={4}>
        <Card isPressable onClick={() => setModalVisible(true)} >
            <Card.Header>
                <Text b>{addressEllipsis(address)}</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ p: 0 }}>
                <Image
                    src={avatarData ?? `https://avatars.dicebear.com/api/pixel-art/${address}.svg`}
                    objectFit="cover"
                    height={140}
                    width="100%"
                />
            </Card.Body>
            <Card.Divider />
            <Card.Footer css={{ justifyItems: "flex-start" }}>
                <Row wrap="wrap" align="center">
                    {connections.slice(0, 2).map(connection => <div style={{ display: 'flex', position: 'relative', width: '60px' }}>
                        {/* @ts-ignore */}
                        <Avatar bordered src={fixIMGForDemo(connection.connectionNFTs[0].image)} />
                        {/* @ts-ignore */}
                        <Avatar bordered style={{ position: 'absolute', left: '15px' }} src={fixIMGForDemo(connection.connectionNFTs[1].image)} />
                    </div>)}
                    {connections.length - 2 > 0 && <Avatar style={{ marginLeft: 'auto' }} text={`+${connections.length - 2}`} />}
                </Row>
            </Card.Footer>
        </Card>
        <Modal
            closeButton
            blur
            scroll
            width="50%"
            aria-labelledby="modal-title"
            open={modalVisible}
            onClose={() => setModalVisible(false)}
        >
            <Modal.Header>{address}</Modal.Header>
            <Modal.Body>
                <Grid.Container gap={2}>
                    <Grid xs={6} css={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'sticky', top: "24px" }}>
                            <Avatar squared bordered css={{ width: '50%', height: 'auto' }} src={avatarData ?? `https://avatars.dicebear.com/api/pixel-art/${address}.svg`} />
                            <Text h3 css={{ alignSelf: 'start' }}>Name Surname</Text>
                            <Text css={{ alignSelf: 'start', textAlign: 'left' }}>Lorem ipsum some other data dont want to include but anywauy, noone writes so long description</Text>
                        </div>
                    </Grid>
                    <Grid xs={6}>
                        <Timeline>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent></TimelineContent>
                            </TimelineItem>
                            {connections.map((connection, idx) => <TimelineItem style={{ height: '100px' }}>
                                <TimelineSeparator>
                                    <TimelineDot color="inherit" style={{ margin: '0 0 10px 0', boxShadow: 'none' }}>
                                        <div style={{ display: 'flex', position: 'relative', width: '60px' }}>
                                            {/* @ts-ignore */}
                                            <Avatar bordered src={fixIMGForDemo(connection.connectionNFTs[0].image)} />
                                            {/* @ts-ignore */}
                                            <Avatar bordered style={{ position: 'absolute', left: '15px' }} src={fixIMGForDemo(connection.connectionNFTs[1].image)} />
                                        </div>
                                    </TimelineDot>
                                    {idx !== connections.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent style={{marginTop: '8px'}}>{new Date(R.max(parseInt(connection.connectionNFTs[0].createdAtTimestamp), parseInt(connection.connectionNFTs[1].createdAtTimestamp)) * 1000).toLocaleDateString("en-US")}</TimelineContent>
                            </TimelineItem>)}
                        </Timeline>
                    </Grid>
                </Grid.Container>
            </Modal.Body>
        </Modal>
    </Grid>
}

export const ConnectionsGrid: FC<{ address?: string }> = ({ address }) => {

    const { data: avatarData } = useEnsAvatar({ addressOrName: address, chainId: 1 });

    const { data } = useGetUserTokensQuery({ endpoint }, { userId: address?.toLowerCase?.() ?? "" }, { enabled: !!address })

    const { user } = data ?? {};

    const [friends, requests] = useMemo(() => user && address ? constructFriends(address, user.created, user.tokens) : [[], []], [user, address])

    //@ts-ignore
    const _friends: Friends = R.reduce((acc, connection) => ({ ...acc, [connection.friend.id]: [...(acc[connection.friend.id] ?? []), connection] }), {}, friends)

    return <Grid.Container css={{ width: "50%" }} gap={2} justify="flex-start">
        {Object.entries(_friends).map(([friendAddress, connections]) => <UserCard address={friendAddress} connections={connections} />)}
        {/* {friends.map((friend, index) => <Grid key={friend.name} xs={2} sm={3} >
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
        </Grid>)} */}
    </Grid.Container>


}