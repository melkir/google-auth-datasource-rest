import { RESTDataSource } from 'apollo-datasource-rest'
import { OAuth2Client } from 'google-auth-library'

/** Groups interfaces */
export interface GetGroupsQueryParams extends PaginatedQueryParams {
  customer?: string
  domain?: string
  orderBy?: OrderByField
  query?: string
  sortOrder?: SortingOrder
  userKey?: string
}

export interface GetGroupsQueryResult extends PaginatedQueryResult {
  kind: 'admin#directory#groups'
  etag: string
  groups: GetGroupQueryResult[] | null
}

export interface GetGroupQueryParams {
  groupKey: string
}

export interface GetGroupQueryResult {
  kind: 'admin#directory#group'
  adminCreated: boolean
  aliases?: Alias[]
  description: string
  directMembersCount: string
  email: string
  etag: string
  id: string
  name: string
  nonEditableAliases?: Alias[]
}

/** Group members interfaces */
export interface GetMembersQueryParams extends PaginatedQueryParams {
  groupKey: string
  includeDerivedMembership?: boolean
  roles?: Role[] | Role | string
}

export interface GetMembersQueryResult extends PaginatedQueryResult {
  kind: 'directory#members'
  etag: string
  members: GetMemberQueryResult[]
}

export interface GetMemberQueryParams {
  groupKey: string
  memberKey: string
}

export interface GetMemberQueryResult {
  kind: 'directory#member'
  email: string
  etag: string
  id: string
  role: Role
  type: Type
  status: Status
}

interface PaginatedQueryParams {
  maxResults?: number
  pageToken?: string
}

interface PaginatedQueryResult {
  nextPageToken?: string
}

export enum OrderByField {
  email = 'email',
}

export enum SortingOrder {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}

export enum Role {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
  MANAGER = 'MANAGER',
}

export enum Type {
  CUSTOMER = 'CUSTOMER',
  EXTERNAL = 'EXTERNAL',
  GROUP = 'GROUP',
  USER = 'USER',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  SUSPENDED = 'SUSPENDED',
  UNKNOWN = 'UNKNOWN',
}

interface Alias {
  alias: string
}

export default class GoogleDataSource extends RESTDataSource {
  private client: OAuth2Client

  constructor(client: OAuth2Client) {
    super()
    this.client = client
    this.baseURL = 'https://www.googleapis.com/admin/directory/v1'
  }

  /*
   * Retrieve the google admin authorization token.
   */
  public async getAuthorization() {
    const { token } = await this.client.getAccessToken()
    if (!token) {
      throw new Error('Unable to retrieve the client access token')
    }
    return token
  }

  /**
   * Retrieve all groups for a domain or the account.
   * https://developers.google.com/admin-sdk/directory/v1/guides/manage-groups#get_all_domain_groups
   * @param query https://developers.google.com/admin-sdk/directory/v1/reference/groups/list
   */
  public async getGroups(params: GetGroupsQueryParams) {
    const token = await this.getAuthorization()
    return this.get<GetGroupsQueryResult>('/groups', {
      access_token: token!,
      ...params,
    })
  }

  /**
   * Retrieves a group's properties.
   * https://developers.google.com/admin-sdk/directory/v1/guides/manage-groups#get_group
   * @param params https://developers.google.com/admin-sdk/directory/v1/reference/groups/get.html
   */
  public async getGroup(params: GetGroupQueryParams) {
    const token = await this.getAuthorization()
    return this.get<GetGroupQueryResult>(`/groups/${params.groupKey}`, {
      access_token: token,
    })
  }

  /**
   * Retrieves all members in a group.
   * https://developers.google.com/admin-sdk/directory/v1/guides/manage-group-members#get_all_members
   * @param params https://developers.google.com/admin-sdk/directory/v1/reference/members/list.html
   */
  public async getMembers(params: GetMembersQueryParams) {
    const token = await this.getAuthorization()
    const { groupKey, ...queryParams } = params

    // Convert roles enum to a string for the request
    if (queryParams.roles && typeof queryParams.roles !== 'string') {
      queryParams.roles = queryParams.roles.toString()
    }

    return this.get<GetMembersQueryResult>(`/groups/${groupKey}/members`, {
      access_token: token,
      ...queryParams,
    })
  }

  /**
   * Retrieves a group member's properties
   * https://developers.google.com/admin-sdk/directory/v1/guides/manage-group-members#get_member
   * @param params https://developers.google.com/admin-sdk/directory/v1/reference/members/get.html
   */
  public async getMember(params: GetMemberQueryParams) {
    const token = await this.getAuthorization()
    return this.get<GetMemberQueryResult>(
      `/groups/${params.groupKey}/members/${params.memberKey}`,
      { access_token: token },
    )
  }
}
