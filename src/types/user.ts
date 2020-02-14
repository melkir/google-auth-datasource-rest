export default interface User {
  id: string
  agreedToTerms: boolean
  archived: boolean
  changePasswordAtNextLogin: boolean
  creationTime: string
  customerId: string
  emails: Email[]
  gender: { type: string }
  includeInGlobalAddressList: boolean
  ipWhitelisted: boolean
  isAdmin: boolean
  isDelegatedAdmin: boolean
  isEnforcedIn2Sv: boolean
  isEnrolledIn2Sv: boolean
  isMailboxSetup: boolean
  lastLoginTime: string
  name: Name
  orgUnitPath: string
  primaryEmail: string
  recoveryEmail: string
  recoveryPhone: string
  suspended: boolean
  thumbnailPhotoEtag: string
  thumbnailPhotoUrl: string
}

interface Email {
  address: string
  primary: boolean
}

interface Name {
  familyName: string
  fullName: string
  givenName: string
}
