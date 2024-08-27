import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Input } from 'antd';

interface OtpInputProps {
  onChange: (newOtp: string) => void;
  handleOptLogin: () => void;
}

const OTPInput = ({ onChange, handleOptLogin }: OtpInputProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const ipt0 = useRef(null);
  const ipt1 = useRef(null);
  const ipt2 = useRef(null);
  const ipt3 = useRef(null);
  const ipt4 = useRef(null);
  const ipt5 = useRef(null);
  const inputRefs = [ipt0, ipt1, ipt2, ipt3, ipt4, ipt5];

  useEffect(() => {
    if (inputRefs[0].current) {
      (inputRefs[0].current as HTMLInputElement).focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    onChange?.(newOtp.join(''));

    if (index < 5 && value !== '' && inputRefs[index + 1].current) {
      (inputRefs[index + 1].current as unknown as HTMLElement).focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && inputRefs[index - 1].current) {
      (inputRefs[index - 1].current as unknown as HTMLElement).focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace' && otp[index] === '') {
      handleBackspace(index);
    }
  };

  const uniqueKeys = ['otp-1', 'otp-2', 'otp-3', 'otp-4', 'otp-5', 'otp-6'];

  return (
    <>
      {uniqueKeys.map((key, index) => (
        <Input
          key={key}
          ref={inputRefs[index]}
          maxLength={1}
          style={{
            width: 40,
            height: 40,
            textAlign: 'center',
            marginRight: '10px',
            marginTop: '16px',
            marginBottom: '12px'
          }}
          value={otp[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onKeyUp={(e) => e.key === 'Enter' && handleOptLogin()}
        />
      ))}
    </>
  );
};

export default OTPInput;
