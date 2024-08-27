export interface UserItem {
  id?: string;
  key: string;
  displayName: string;
  emailAddress: string;
  emailGroup: string;
  emailGroupLabel: string;
  userRole: string[];
  userRoleLabel: string[];
  tenantName: string;
  tenantNameLabel: string;
  userStatus: string;
  userStatusLabel: string;
  accountStatus: string;
  accountStatusLabel: string;
}

export interface AddressBookItem {
  id?: string;
  displayName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  faxNumber: string;
  location: string;
  position: string;
  rank: string;
  substantiveRank: string;
  title: string;
  unit: string;
  tenantName: string;
  tenantNameLabel: string;
  userStatus?: string;
  userRole?: string[];
  accountStatus?: string;
}

export interface AddressBookProps {
  onAdd: (record: AddressBookItem) => void;
}

export interface AddUserForm {
  userStatus?: string;
  accountStatus?: string;
  userRole: string[];
}
