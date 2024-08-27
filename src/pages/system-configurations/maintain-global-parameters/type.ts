export interface IGlobalParametersProps {
  passwordExpiryTime: number;
  systemIdleTimeout: number;
  systemLockout: SystemLockoutProps;
  emailAddress: EmailAddressProps;
  purgeArchiveLogs: number;
  fAQsConfiguration: FAQsConfigurationProps;
  notificationHistory: number;
  messageParameters: IMessageParametersItem;
  Appearance: AppearanceProps;
}
export interface EmailAddressProps {
  maxEmailAddress: number;
  maxTotalAttachmentSize: number;
  totalAttachment: number;
}

export interface SystemLockoutProps {
  systemLockedTime: number;
  numberFailureLoginAttempts: number;
}

export interface FAQsConfigurationProps {
  faq: FAQsConfigurationItemProps;
  mobileFaq: FAQsConfigurationItemProps;
  customerSupPage: FAQsConfigurationItemProps;
  passwordPolicy: FAQsConfigurationItemProps;
}

export interface FAQsConfigurationItemProps {
  english: string;
  traditionalChinese: string;
  simplifiedChinese: string;
}

export interface AppearanceProps {
  webApp: AppearanceItem;
  mobileApp: AppearanceItem;
}

export type AppearanceItem = {
  logo: string;
  applicationName: string;
  appLogoFileName: string;
};

export type Tkeys =
  | 'passwordExpiryTime'
  | 'systemIdleTimeout'
  | 'systemLockout'
  | 'emailAddress'
  | 'purgeArchiveLogs'
  | 'fAQsConfiguration'
  | 'notificationHistory'
  | 'messageParameters'
  | 'Appearance';
export interface UpdateGlobalParameterProps {
  type: Tkeys;
  value:
    | number
    | FAQsConfigurationProps
    | SystemLockoutProps
    | EmailAddressProps
    | IMessageParametersItem
    | AppearanceProps;
  userId: string;
}
export interface IMessageParametersItem {
  maxEmailAddress: number;
  maxMessageSendPeriod: number;
  maxMessageSendCount: number;
}
