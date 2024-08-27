import {
  ProFormText,
  ProFormTextArea,
  ProFormSwitch
} from '@ant-design/pro-components';

const AddIPWhitelistForm = () => {
  const isValidIPAddress = (ipString: string) => {
    const ipRegex =
      /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/([1-9]\d?))?$/;
    const match = ipRegex.exec(ipString);
    if (!match) {
      return false;
    }
    const [, octet1, octet2, octet3, octet4, cidr] = match;
    return (
      parseInt(octet1, 10) >= 0 &&
      parseInt(octet1, 10) <= 255 &&
      parseInt(octet2, 10) >= 0 &&
      parseInt(octet2, 10) <= 255 &&
      parseInt(octet3, 10) >= 0 &&
      parseInt(octet3, 10) <= 255 &&
      parseInt(octet4, 10) >= 0 &&
      parseInt(octet4, 10) <= 255 &&
      (!cidr || (parseInt(cidr, 10) >= 0 && parseInt(cidr, 10) <= 32))
    );
  };

  return (
    <>
      <ProFormText
        name="ipAddress"
        label={$t('IP Address')}
        tooltip={$t('IP / IPv4 CIDR')}
        rules={[
          {
            required: true
          },
          () => ({
            validator(_, value) {
              if (!value || isValidIPAddress(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error($t('Please enter the correct IP address!'))
              );
            }
          })
        ]}
      />
      <ProFormTextArea
        name="remark"
        label={$t('Remark')}
        rules={[
          { max: 200, message: $t('Remark cannot exceed 200 characters!') }
        ]}
      />
      <ProFormSwitch
        name="status"
        label={$t('Status')}
        checkedChildren={$t('Active')}
        unCheckedChildren={$t('Disable')}
        initialValue={true}
      />
    </>
  );
};

export default AddIPWhitelistForm;
