export type SearchParams = SearchCommonParams & {
  displayName?: string;
  emailAddress?: string;
  emailGroup?: string;
  userRole?: string;
  tenantName?: string;
  userStatus?: string;
  accountStatus?: string;
  certType?: string;
  certStatus?: string;
  certExpiration?: string;
  certApprovalStatus?: string;
};

export interface SearchResponse {
  userId?: string;
  userCertId?: string;
  displayName: string;
  emailAddress: string;
  tenantName: string;
  emailGroup: string;
  userRole: string;
  userStatus: string;
  userStatusLabel: string;
  accountStatus: string;
  accountStatusLabel: string;
  certType: string;
  certTypeLabel: string;
  certStatus: string;
  certStatusLabel: string;
  certApprStatus: string;
  certApprStatusLabel: string;
  validFrom: string;
  validTo: string;
  certExpiration?: string;
  issueToOu3?: string;
  issueToOu4?: string;
}

export type BasicParams = {
  userId: string;
};
export type BasicCertList = SearchCommonParams & {
  userId: string | undefined;
  certType: string;
};
export type CertDetail = {
  userCertId: string;
};
export type UpdateApprStatus = {
  userCertId?: string;
  apprStatus?: string;
};

export interface CertCreate {
  userCertId?: string;
  userId?: string;
  certType?: string;
  certStatus?: string;
  apprStatus?: string;
  issueToCn: string;
  issueToE: string;
  issueToOu1: string;
  issueToOu2: string;
  issueToOu3: string;
  issueToOu4: string;
  issueToO: string;
  issueToL: string;
  issueToS: string;
  issueToC: string;
  validMonth: string;
  validFrom: string | number;
  validTo: string | number;
  creBy?: string;
  updBy?: string;
  creDt?: string;
  updDt?: string;
  verNo?: number;
}
