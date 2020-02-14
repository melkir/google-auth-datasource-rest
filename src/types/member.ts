export default interface Member {
  delivery_settings: string
  email: string
  id: string
  role: Role
  status: Status
  type: Type
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
