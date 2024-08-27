import { Counter } from './';
import { EmailAddressProps } from '../type';
interface PETProps {
  values: EmailAddressProps;
  onChange: (values: EmailAddressProps) => void;
}
const Index = (props: PETProps) => {
  const { values, onChange } = props;

  return (
    <>
      <Counter
        label="Maximum Email Addresses Supported Per Message"
        value={values.maxEmailAddress}
        onChange={(value: number) => {
          onChange(Object.assign(values, { maxEmailAddress: value }));
        }}
      />
      <Counter
        label="Maximum Total Attachment Size Per Message"
        value={values.maxTotalAttachmentSize}
        onChange={(value: number) => {
          onChange(Object.assign(values, { maxTotalAttachmentSize: value }));
        }}
        suffix="MB"
      />

      <Counter
        label="Total Number of Attachment Per Message"
        value={values.totalAttachment}
        onChange={(value: number) => {
          onChange(Object.assign(values, { totalAttachment: value }));
        }}
      />
    </>
  );
};

export default Index;
