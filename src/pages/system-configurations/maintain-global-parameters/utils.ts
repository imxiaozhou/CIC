import React from 'react';
import { IGlobalParametersProps } from './type';
export const GrandParentContext = React.createContext(null);

export const GlobalParameterInitialValues: IGlobalParametersProps = {
  passwordExpiryTime: 0,
  systemIdleTimeout: 0,
  systemLockout: {
    systemLockedTime: 0,
    numberFailureLoginAttempts: 0
  },
  emailAddress: {
    maxEmailAddress: 0,
    maxTotalAttachmentSize: 0,
    totalAttachment: 0
  },
  purgeArchiveLogs: 0,
  fAQsConfiguration: {
    faq: {
      english: '',
      traditionalChinese: '',
      simplifiedChinese: ''
    },
    mobileFaq: {
      english: '',
      traditionalChinese: '',
      simplifiedChinese: ''
    },
    customerSupPage: {
      english: '',
      traditionalChinese: '',
      simplifiedChinese: ''
    },
    passwordPolicy: {
      english: '',
      traditionalChinese: '',
      simplifiedChinese: ''
    }
  },
  notificationHistory: 0,
  messageParameters: {
    maxEmailAddress: 10,
    maxMessageSendPeriod: 10,
    maxMessageSendCount: 10
  },
  Appearance: {
    webApp: {
      logo: '',
      appLogoFileName: '',
      applicationName: ''
    },
    mobileApp: {
      logo: '',
      appLogoFileName: '',
      applicationName: ''
    }
  }
};
