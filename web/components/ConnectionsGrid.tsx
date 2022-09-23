import { Card, Grid, Row, Text } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo } from "react";
import { useGetUserTokensQuery } from "../graphqlGenerates";
import * as R from 'ramda'
import { useEnsAvatar } from 'wagmi'

const endpoint = "https://api.thegraph.com/subgraphs/name/houstoten/popgraph"

type ConnectionNFTs = [{ tokenID: BigInt, metadataURI: string, creator: { id: string } }, { tokenID: BigInt, metadataURI: string, owner: { id: string } }]

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

const UserCard: FC<{ address: string, connectionNFTs: ConnectionNFTs }> = ({ address, connectionNFTs }) => {

    const { data: avatarData } = useEnsAvatar({ addressOrName: address, chainId: 1 });

    // const {} = useEns

    return <Grid key={address} xs={2} sm={3} >
        <Card isPressable >
            <Card.Body css={{ p: 0 }}>
                <Image
                    src={avatarData ?? ""}
                    objectFit="cover"
                    height={140}
                    width="100%"
                />
            </Card.Body>
            <Card.Footer css={{ justifyItems: "flex-start" }}>
                <Row wrap="wrap" justify="space-between" align="center">
                    <Text b>{address}</Text>
                    {/* <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                        {friend.address}
                    </Text> */}
                </Row>
            </Card.Footer>
        </Card>
    </Grid>

}

export const ConnectionsGrid: FC<{ address?: string }> = ({ address }) => {

    const { data: avatarData } = useEnsAvatar({ addressOrName: address, chainId: 1 });

    const { data } = useGetUserTokensQuery({ endpoint }, { userId: address?.toLowerCase?.() ?? "" }, { enabled: !!address })

    const { user } = data ?? {};

    const [friends, requests] = useMemo(() => user && address ? constructFriends(address, user.created, user.tokens) : [[], []], [user, address])

    console.log({ avatarData })

    return <Grid.Container css={{ width: "50%" }} gap={2} justify="flex-start">
        {friends.map(( { friend, connectionNFTs } ) => <UserCard address={friend.id} connectionNFTs={connectionNFTs}/>)}
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