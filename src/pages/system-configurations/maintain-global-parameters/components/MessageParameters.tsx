import { IMessageParametersItem } from '../type';
import Counter from './Counter';
interface MessageParametersProps {
  values: IMessageParametersItem;
  onChange: (values: IMessageParametersItem) => void;
}
const Index = (props: MessageParametersProps) => {
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
        label="Predefined Period(Minutes)"
        value={values.maxMessageSendPeriod}
        onChange={(value: number) => {
          onChange(Object.assign(values, { maxMessageSendPeriod: value }));
        }}
        suffix="MB"
      />

      <Counter
        label="No.of messages that can be sent within the predefined period"
        value={values.maxMessageSendCount}
        onChange={(value: number) => {
          onChange(Object.assign(values, { maxMessageSendCount: value }));
        }}
      />
    </>
  );
};

export default Index;
