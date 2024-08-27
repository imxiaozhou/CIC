export interface BasicInfoInterface {
  displayName: string;
  emailAddress: string;
  tenantName: string;
  tenantTCName: string;
  tenantSCName: string;
  emailGroup: string;
  userRole: string;
  userStatus: string;
  userStatusLabel: string;
  accountStatus: string;
  accountStatusLabel: string;
  tenantCode: string;
}

export type CertificationTypeItem = {
  userCertId: string;
  userId?: string;
  cmaCertId: string;
  certType: string;
  certTypeLabel: string;
  certStatus: string;
  certStatusLabel: string;
  apprStatus: string;
  apprStatusLabel: string;
  validFrom?: string;
  validTo?: string;
  creDt?: string;
  verNo?: number;
};

export interface CertificateDetailReqInterface {
  id: string;
  key: string;
  type: string;
  approvalStatus: string;
}

export interface CertDetail {
  userCertId?: string;
  userId?: string;
  cmaCertId?: string;
  creBy?: number;
  updBy?: number;
  creDt?: string;
  updDt?: string;
  verNo?: number;
  certType: string;
  certTypeLabel: string;
  certStatus: string;
  certStatusLabel: string;
  apprStatus: string;
  apprStatusLabel: string;
  signerCn: string;
  signerE: string;
  signerOu1: string;
  signerOu2: string;
  signerO: string;
  signerC: string;
  issuerCn: string;
  issuerE: string;
  issuerOu1: string;
  issuerOu2: string;
  issueToOu1: string;
  issueToOu2: string;
  issueToOu3: string;
  issueToOu4: string;
  issuerO: string;
  issuerC: string;
  validFrom: string;
  validTo: string;
  certVersion: any;
  certSerNo: any;
  certSignAlgor: any;
  certFingerprint: any;
}
