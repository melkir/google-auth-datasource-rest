## Installation

```bash
yarn install google-auth-datasource-rest
```

## Usage

Using Apollo Server:

```bash
yarn add apollo-server@0.13.2 graphql google-auth-datasource-rest google-auth-library
yarn add -D typescript @types/node
```

```js
// server.ts

import { ApolloServer, gql, ServerInfo } from "apollo-server";
import { OAuth2Client } from "google-auth-library";

import GoogleDataSource, {
  GetGroupQueryParams,
  GetGroupsQueryParams,
  GetMemberQueryParams,
  GetMembersQueryParams
} from "google-auth-datasource-rest";

const typeDefs = gql`
  type Group {
    kind: String!
    adminCreated: Boolean!
    aliases: [Alias]
    description: String!
    directMembersCount: String!
    email: String!
    etag: String!
    id: String!
    name: String!
    nonEditableAliases: [Alias]
  }

  type Alias {
    alias: String
  }

  type Member {
    kind: String!
    delivery_settings: String!
    email: String!
    etag: String!
    id: String!
    role: Role!
    type: Type!
    status: Status!
  }

  enum Role {
    OWNER
    MANAGER
    MEMBER
  }

  enum Type {
    CUSTOMER
    EXTERNAL
    GROUP
    USER
  }

  enum Status {
    ACTIVE
    ARCHIVED
    SUSPENDED
    UNKNOWN
  }

  enum SortingOrder {
    ASCENDING
    DESCENDING
  }

  enum OrderByField {
    email
  }

  input GroupsInput {
    customer: String
    domain: String
    orderBy: OrderByField
    query: String
    sortOrder: SortingOrder
    userKey: String
  }

  input GroupInput {
    groupKey: String!
  }

  input MembersInput {
    groupKey: String!
    includeDerivedMembership: Boolean
    roles: [Role]
  }

  input MemberInput {
    groupKey: String
    memberKey: String
  }

  type Query {
    groups(where: GroupsInput!): [Group]
    group(where: GroupInput!): Group
    members(where: MembersInput!): [Member]
    member(where: MemberInput): Member
  }
`;

const resolvers = {
  Query: {
    groups: async (
      _source: unknown,
      { where }: { where: GetGroupsQueryParams },
      { dataSources }: Context
    ) => {
      const { groups } = await dataSources.googleAPI.getGroups(where);
      return groups;
    },

    group: async (
      _source: unknown,
      { where }: { where: GetGroupQueryParams },
      { dataSources }: Context
    ) => {
      const group = await dataSources.googleAPI.getGroup(where);
      return group;
    },

    members: async (
      _source: unknown,
      { where }: { where: GetMembersQueryParams },
      { dataSources }: Context
    ) => {
      const { members } = await dataSources.googleAPI.getMembers(where);
      return members;
    },

    member: async (
      _source: unknown,
      { where }: { where: GetMemberQueryParams },
      { dataSources }: Context
    ) => {
      const member = await dataSources.googleAPI.getMember(where);
      return member;
    }
  }
};

interface Context {
  dataSources: ReturnType<typeof createDataSources>;
}

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN
} = process.env;

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const createDataSources = () => ({
  googleAPI: new GoogleDataSource(client)
});

const server = new ApolloServer({
  dataSources: createDataSources,
  resolvers,
  typeDefs
});

server.listen().then(({ url }: ServerInfo) => {
  console.log(`🕸  Server ready at ${url}`);
});
```

Run

```
> tsc && node server.js
```
