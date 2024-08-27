export type SearchParams = SearchCommonParams & {
  displayName?: string;
  emailAddress?: string;
  emailGroup?: string;
  userRole?: string;
  tenantName?: string;
  userStatus?: string;
  accountStatus?: string;
};

export type DeleteParams = {
  uids: string[];
};

export type SearchAddressBook = SearchCommonParams & {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  faxNumber?: string;
  location?: string;
  position?: string;
  rank?: string;
  substantiveRank?: string;
  title?: string;
  unit?: string;
  tenantName?: string;
  addressBookType?: string;
};

export interface SearchResponse {
  id: string;
  displayName: string;
  emailAddress: string;
  emailGroup: string;
  emailGroupLabel: string;
  userRole: string;
  userRoleLabel: string;
  tenantName: string;
  tenantNameLabel: string;
  userStatus: string;
  userStatusLabel: string;
  accountStatus: string;
  accountStatusLabel: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  faxNumber?: string;
  location?: string;
  position: string;
  rank: string;
  substantiveRank?: string;
  title?: string;
  unit?: string;
  requestBy: string;
  requestTime: string;
  approveBy: string;
  approveTime: string;
  rejectBy: string;
  rejectTime: string;
}

export interface SubmitUser {
  id?: string;
  displayName: string;
  emailAddress: string;
  emailGroup?: string;
  emailGroupLabel?: string;
  userRole: string[];
  tenantName: string;
  tenantNameLabel?: string;
  userStatus?: string;
  userStatusLabel?: string;
  accountStatus?: string;
  accountStatusLabel?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  faxNumber: string;
  location: string;
  position: string;
  rank: string;
  substantiveRank?: string;
  title: string;
  unit: string;
}

export interface IdOrids {
  id?: string;
  ids?: string[];
  emailAddress?: string;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordParams {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}
