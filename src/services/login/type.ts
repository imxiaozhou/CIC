export interface UserId {
  userId: string;
}

export interface UserInfo {
  id?: string;
  userId?: string;
  displayName?: string;
  emailAddress?: string;
  emailGroup?: string;
  emailGroupLabel?: string;
  role?: string;
  roleLabel?: string;
  userRole?: string[];
  userRoleLabel?: string[];
  tenantName?: string;
  tenantNameLabel?: string;
  userStatus?: string;
  userStatusLabel?: string;
  accountStatus?: string;
  accountStatusLabel?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  faxNumber?: string;
  location?: string;
  position?: string;
  rank?: string;
  substantiveRank?: string;
  title?: string;
  unit?: string;
  requestBy?: string;
  requestTime?: string;
  approveBy?: string;
  approveTime?: string;
  rejectBy?: string;
  rejectTime?: string;
}

export interface ValidateUserIP {
  ip: string;
  result: string;
  message: string;
}

export interface ValidateOtp {
  otp: string;
}

export interface ValidateOtpResponse {
  activeCode: string;
  remainingTimes: number;
  responseCode: string;
  responseRemark: string;
  seedFile: string;
}
