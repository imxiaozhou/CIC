import { Counter } from './';

interface Values {
  systemLockedTime: number;
  numberFailureLoginAttempts: number;
}
interface PETProps {
  values: Values;
  onChange: (values: Values) => void;
}
const Index = (props: PETProps) => {
  const { values, onChange } = props;

  return (
    <>
      <Counter
        label="System Lockout Time"
        value={values.systemLockedTime}
        onChange={(value: number) => {
          onChange(Object.assign(values, { systemLockedTime: value }));
        }}
        suffix="Minutes"
      />
      <Counter
        label="Number of Failure Login Attempts"
        value={values.numberFailureLoginAttempts}
        onChange={(value: number) => {
          onChange(
            Object.assign(values, { numberFailureLoginAttempts: value })
          );
        }}
      />
    </>
  );
};

export default Index;
