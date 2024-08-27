export interface ApproCertSearchParams extends SearchCommonParams {
  certApprovalStatus?: string;
  displayName?: string;
  emailAddress?: string;
  emailGroup?: string;
  userRole?: string;
  tenantName?: string;
  userStatus?: string;
  accountStatus?: string;
}

export interface ApproCertSearchResponse {
  id: string;
  emailAddress: string;
  displayName: string;
  tenantName: string;
  tenantNameLabel: string;
  emailGroup: string;
  emailGroupLabel: string;
  userRole: string[];
  userRoleLabel: string[];
  userStatus: string;
  userStatusLabel: string;
  accountStatus: string;
  accountStatusLabel: string;
  certType: string;
  certTypeLabel: string;
  certStatus: string;
  certStatusLabel: string;
  validFrom: string;
  validTo: string;
  certApprovalStatus: string;
  certApprovalStatusLabel: string;
}

export interface ApproveCertPageDataParams extends SearchCommonParams {
  id: string;
  certificationType: string;
}

export interface ApproveCertPageDataResponse {
  id: string;
  user_id: string;
  expiration?: string;
  certificationType: string;
  certificationTypeLabel: string;
  certificationStatus: string;
  certStatusLabel: string;
  approvalStatus: string;
  certApprovalStatusLabel: string;
  validFrom?: string;
  validTo?: string;
  creDt?: string;
}

export interface ApproveCertPageDataBasicParams {
  id: string;
}

export interface ApproCertPageDataBasicResponse {
  id: string;
  displayName: string;
  emailAddress: string;
  tenantName: string;
  tenantSCName: string;
  tenantTCName: string;
  tenantNameLabel: string;
  emailGroup: string;
  emailGroupLabel: string;
  userRole: string[];
  userRoleLabel: string[];
  userStatus: string;
  userStatusLabel: string;
  accountStatus: string;
  accountStatusLabel: string;
}

export interface ApproveCertPageDataDetailParams {
  id: string;
}

export interface ApproveCertPageDataDetailResponse {
  textItems: TextItems;
  issueToItems: IssueToItems;
  issueByItems: IssueByItems;
  validityPeriodItems: ValidityPeriodItems;
}

export interface ValidityPeriodItems {
  validFrom: string;
  validTo: string;
  version: string;
  serialNumber: string;
  signatureAlgorithm: string;
  fingerprint: string;
}

export interface IssueByItems {
  commonNameCN: string;
  organisationUnitOU: string;
  locateL: string;
  stateProvinceS: string;
  countryRegionC: string;
}

export interface IssueToItems {
  commonNameCN: string;
  emailE: string;
  organisationUnitOU1: string;
  organisationUnitOU2: string;
  organisationUnitOU3: string;
  organisationUnitOU4: string;
  organisationO: string;
  countryOrRegionC: string;
}

export interface TextItems {
  certificateType: string;
  certificateTypeLabel: string;
  expiration: string;
  certificateStatus?: string;
  certificateStatusLabel?: string;
  approvalStatus: string;
  approvalStatusLabel?: string;
}

export interface CertPageDataApproveReject {
  id: string;
  approvalStatus: string;
}
