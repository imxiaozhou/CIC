import { Col } from 'antd';
import { ProFormDateRangePicker } from '@ant-design/pro-components';

export const RangeProformContent = () => {
  return (
    <>
      <ProFormDateRangePicker
        width="md"
        label={$t('Period')}
        name="periodFromToDate"
        colProps={{
          xl: 8,
          md: 12
        }}
        rules={[
          {
            required: true,
            message: $t('Please Select Period')
          }
        ]}
      />
      <Col xl={8} md={12} />
    </>
  );
};
