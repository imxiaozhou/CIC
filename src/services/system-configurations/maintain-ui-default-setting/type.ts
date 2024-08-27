export type MaintainUiDefaultSettingParams = SearchCommonParams & {
  tenantName?: string;
};

export interface MaintainUiDefaultSettingResponse {
  organisationStatus: string;
  organisationStatusLabel: string;
  tenantName: string;
  tntId: string;
}

export interface MaintainUiDefaultDetailParams {
  tntId: string;
}

export interface MaintainUiDefaultSettingDetailResponse {
  maintainAppearance: {
    tenantName: string;
    theme: string;
    colourTheme: string;
  };
  webApp: {
    fontSize: string;
    dateFormat: string;
    language: string;
  };
  mobileApp: {
    fontSize: string;
    dateFormat: string;
    language: string;
  };
}

export type submitMaintainUiDefaultDetailParams =
  MaintainUiDefaultSettingDetailResponse & {
    tntId?: string;
  };
