import type {
  ModalProps,
  SpaceProps,
  TagProps,
  ButtonProps,
  FormInstance,
  SelectProps,
  TableProps
} from 'antd';
import type { ProTableProps } from '@ant-design/pro-components';

export type CustomModalProps = ModalProps & {
  type: 'info' | 'warning';
};

export interface TagMultipleProps {
  size?: SpaceProps['size'];
  // disabled?: boolean;
  items: LabelValue[];
  onChange: (tags: LabelValue[]) => void;
}

export type TagStatusProps = TagProps & {
  status: string;
};

export type TagColorProps = TagProps & {
  color: string;
  fontColor: string;
};

export type TableOnChange = NonNullable<TableProps<any>['onChange']>;

type GetSingle<T> = T extends (infer U)[] ? U : never;
export type TableSorts = GetSingle<Parameters<TableOnChange>[2]>;

interface NameValue {
  name: string;
  value: string;
}
export interface CustomProTableProps
  extends ProTableProps<any, Record<string, any>> {
  searchTitle?: React.ReactNode;
  sorter?: TableSorts;
  initParams?: NameValue[];
  onResetCallback?: () => void;
}

export type CustomFormButtonProps = ButtonProps & {
  title?: React.ReactNode;
  okText?: string;
  onConfirm?: () => Promise<void> | void;
  formInstance?: FormInstance;
};

export type CustomCancelButtonProps = ButtonProps & {
  title?: string;
};

export type SelectSearchableProps = SelectProps & {
  url?: string;
  mode?: 'multiple';
  onValueChange: (newValue: LabelValue[]) => void; // newValue value值组成的数组，如果是单选则在调用方取newValue[0]，多选则直接在调用方取newValue
};

export interface CustomPrintButtonProps {
  handlePrintInCSV: () => void;
  handlePrintInPDF: () => void;
}
