import { useQuery, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: BigInt;
};

export type ConnectionNft = {
  __typename?: 'ConnectionNFT';
  contentURI: Scalars['String'];
  createdAtTimestamp: Scalars['BigInt'];
  creator: User;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  metadataURI: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  owner: User;
  tokenID: Scalars['BigInt'];
};

export type GetUserTokens = {
  __typename?: 'GetUserTokens';
  user?: Maybe<User>;
};


export type GetUserTokensUserArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  created: Array<ConnectionNft>;
  id: Scalars['ID'];
  tokens: Array<ConnectionNft>;
};

export type GetUserTokensQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetUserTokensQuery = { __typename?: 'GetUserTokens', user?: { __typename?: 'User', tokens: Array<{ __typename?: 'ConnectionNFT', tokenID: BigInt, createdAtTimestamp: BigInt, name?: string | null, description?: string | null, image?: string | null, metadataURI: string, creator: { __typename?: 'User', id: string } }>, created: Array<{ __typename?: 'ConnectionNFT', tokenID: BigInt, createdAtTimestamp: BigInt, name?: string | null, description?: string | null, image?: string | null, metadataURI: string, owner: { __typename?: 'User', id: string } }> } | null };


export const GetUserTokensDocument = `
    query getUserTokens($userId: ID!) {
  user(id: $userId) {
    tokens {
      tokenID
      createdAtTimestamp
      name
      description
      image
      metadataURI
      creator {
        id
      }
    }
    created {
      tokenID
      createdAtTimestamp
      name
      description
      image
      metadataURI
      owner {
        id
      }
    }
  }
}
    `;
export const useGetUserTokensQuery = <
      TData = GetUserTokensQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetUserTokensQueryVariables,
      options?: UseQueryOptions<GetUserTokensQuery, TError, TData>
    ) =>
    useQuery<GetUserTokensQuery, TError, TData>(
      ['getUserTokens', variables],
      fetcher<GetUserTokensQuery, GetUserTokensQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetUserTokensDocument, variables),
      options
    );