export interface FavoritesType {
  code?: string;
  label: string;
}

export interface ILookup {
  uid: string;
  userName: string;
  userEmail: string;
  userTenant: string;
}

export interface LookupUserProps {
  onAdd: (record: ILookup, type: string) => void;
  type?: string;
}

export interface Limit {
  number: number;
  unit: string;
}

export interface MessageStorageQuotaItem {
  id?: string;
  selectedGroup: LabelValue[];
  warningLevel: Limit;
  cannotSendLimit: Limit;
  cannotReceiveLimit: Limit;
}

export interface AdjustMessageStorageQuotaProp {
  selectedTitle: string;
  data: MessageStorageQuotaItem;
  onUpdate: (fields: MessageStorageQuotaItem) => Promise<void> | void;
  successTitle?: string;
}

export interface AccessDashboardType {
  title: string;
  btnText: string;
  url: string;
}

export interface CounterButtonProps {
  value: number;
  precision?: number;
  onChange: (value: number | null) => void;
}

export interface UnitSelectProps {
  value: string;
  onChange: (value: string) => void;
  keyId: string;
  unitOptions: LabelValue[];
}
