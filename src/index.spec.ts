import { OAuth2Client } from 'google-auth-library'

import GoogleDataSource from '.'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } from '../environment'

describe('GoogleDataSource', () => {
  let gApi: GoogleDataSource

  beforeAll(() => {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
    gApi = new GoogleDataSource(client)
    // @ts-ignore: Property 'cache' is missing
    gApi.initialize({ context: {} })
  })

  const groupsProperties = {
    kind: 'admin#directory#groups',
    etag: expect.any(String),
    groups: expect.any(Array),
    nextPageToken: expect.any(String),
  }

  const groupProperties = {
    kind: 'admin#directory#group',
    adminCreated: expect.any(Boolean),
    description: expect.any(String),
    directMembersCount: expect.any(String),
    email: expect.any(String),
    etag: expect.any(String),
    id: expect.any(String),
    name: expect.any(String),
  }

  const membersProperties = {
    kind: 'admin#directory#members',
    etag: expect.any(String),
    members: expect.any(Array),
  }

  const memberProperties = {
    kind: 'admin#directory#member',
    delivery_settings: expect.any(String),
    email: expect.any(String),
    etag: expect.any(String),
    id: expect.any(String),
    role: expect.any(String),
    status: expect.any(String),
    type: expect.any(String),
  }

  const usersProperties = {
    kind: 'admin#directory#users',
    etag: expect.any(String),
    users: expect.any(Array),
    nextPageToken: expect.any(String),
  }

  const userProperties = {
    kind: 'admin#directory#user',
    etag: expect.any(String),
    id: expect.any(String),
    agreedToTerms: expect.any(Boolean),
    archived: expect.any(Boolean),
    changePasswordAtNextLogin: expect.any(Boolean),
    creationTime: expect.any(String),
    customerId: expect.any(String),
    emails: expect.arrayContaining([
      expect.objectContaining({
        address: expect.any(String),
        primary: expect.any(Boolean),
      }),
    ]),
    gender: expect.objectContaining({
      type: expect.any(String),
    }),
    includeInGlobalAddressList: expect.any(Boolean),
    ipWhitelisted: expect.any(Boolean),
    isAdmin: expect.any(Boolean),
    isDelegatedAdmin: expect.any(Boolean),
    isEnforcedIn2Sv: expect.any(Boolean),
    isEnrolledIn2Sv: expect.any(Boolean),
    isMailboxSetup: expect.any(Boolean),
    lastLoginTime: expect.any(String),
    name: expect.objectContaining({
      familyName: expect.any(String),
      fullName: expect.any(String),
      givenName: expect.any(String),
    }),
    orgUnitPath: expect.any(String),
    primaryEmail: expect.any(String),
    recoveryEmail: expect.any(String),
    recoveryPhone: expect.any(String),
    suspended: expect.any(Boolean),
    thumbnailPhotoEtag: expect.any(String),
    thumbnailPhotoUrl: expect.any(String),
  }

  it('getAuthorization() should return a token', () => {
    const token = gApi.getAuthorization()
    expect(token).toBeDefined()
  })

  it('getGroups() should return the groups', async () => {
    const groups = await gApi.getGroups({ domain: 'payfit.com' })
    expect(groups).toEqual(groupsProperties)
  })

  it('getGroup() should return a group', async () => {
    const group = await gApi.getGroup({ groupKey: '01302m9210vl78u' })
    expect(group).toEqual(groupProperties)
  })

  it('getMembers() should return the members', async () => {
    const members = await gApi.getMembers({
      groupKey: '01302m9210vl78u',
      includeDerivedMembership: true,
    })
    expect(members).toEqual(membersProperties)
  })

  it('getMember() should return the member', async () => {
    const member = await gApi.getMember({
      groupKey: '01302m9210vl78u',
      memberKey: '104405786331979936146',
    })
    expect(member).toEqual(memberProperties)
  })

  it('getUsers() should return the users', async () => {
    const users = await gApi.getUsers({ domain: 'payfit.com' })
    expect(users).toEqual(usersProperties)
  })

  it('getUser() should return the users', async () => {
    const user = await gApi.getUser({ userKey: '115136614780728779802' })
    expect(user).toEqual(userProperties)
  })
})
