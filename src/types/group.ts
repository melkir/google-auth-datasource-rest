export default interface Group {
  id: string
  adminCreated: boolean
  aliases: Alias[]
  description: string
  directMembersCount: string
  email: string
  etag: string
  name: string
  nonEditableAliases: Alias[]
}

interface Alias {
  alias: string
}
