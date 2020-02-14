import { RESTDataSource } from 'apollo-datasource-rest'
import { OAuth2Client } from 'google-auth-library'

import { Group, Member, Role, User } from './types'

/** Generic interfaces */
interface PaginatedQueryParams {
  maxResults?: number
  pageToken?: string
}

interface PaginatedQueryResult {
  nextPageToken?: string
}

export type SortOrder = 'ASCENDING' | 'DESCENDING'

/** Groups interfaces */
export interface GetGroupsQueryParams extends PaginatedQueryParams {
  customer?: string
  domain?: string
  orderBy?: 'email'
  query?: string
  sortOrder?: SortOrder
  userKey?: string
}

export interface GetGroupsQueryResult extends PaginatedQueryResult {
  kind: 'admin#directory#groups'
  etag: string
  groups: Group[] | null
}

export interface GetGroupQueryParams {
  groupKey: string
}

export interface GetGroupQueryResult extends Group {
  kind: 'admin#directory#group'
}

/** Group members interfaces */
export interface GetMembersQueryParams extends PaginatedQueryParams {
  groupKey: string
  includeDerivedMembership?: boolean
  roles?: Role[] | Role | string
}

export interface GetMembersQueryResult extends PaginatedQueryResult {
  kind: 'admin#directory#members'
  etag: string
  members: Member[]
}

export interface GetMemberQueryParams {
  groupKey: string
  memberKey: string
}

export interface GetMemberQueryResult extends Member {
  kind: 'admin#directory#member'
  etag: string
}

/** User interfaces */

export interface GetUsersQueryParams extends PaginatedQueryParams {
  customer?: string
  domain?: string
  orderBy?: OrderUserByField
  customFieldMask?: string
  projection?: Projection
  viewType?: ViewType
  query?: string
  showDeleted?: boolean
  sortOrder?: SortOrder
}

export interface GetUsersQueryResult extends PaginatedQueryResult {
  kind: 'admin#directory#users'
  etag: string
  users: User[]
}

export interface GetUserQueryParams {
  userKey: string
  customFieldMask?: string
  projection?: Projection
  viewType?: ViewType
}

export interface GetUserQueryResult extends User {
  kind: 'admin#directory#user'
}

export type OrderUserByField = 'email' | 'familyName' | 'givenName'
export type Projection = 'basic' | 'custom' | 'full'
export type ViewType = 'admin_view' | 'domain_public'

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

  /**
   * Retrieves a paginated list of either deleted users or all users in a domain.
   * https://developers.google.com/admin-sdk/directory/v1/reference/users/list.html
   * @param params
   */
  public async getUsers(params: GetUsersQueryParams) {
    const token = await this.getAuthorization()
    return this.get<GetUsersQueryResult>('/users', {
      access_token: token,
      ...params,
    })
  }

  /**
   * Retrieves a user's properties
   * https://developers.google.com/admin-sdk/directory/v1/guides/manage-users#get_user
   * @param params
   */
  public async getUser(params: GetUserQueryParams) {
    const token = await this.getAuthorization()
    return this.get<GetUserQueryResult>(`/users/${params.userKey}`, {
      access_token: token,
    })
  }
}
