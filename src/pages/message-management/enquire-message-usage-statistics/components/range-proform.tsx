import dayjs from 'dayjs';
import { Button, Col, Space } from 'antd';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { ProForm } from '@ant-design/pro-components';

interface CertificateDataParam {
  email: string;
  periodFromToDate: string[];
}

interface PropsInterface {
  formRef: any;
  postCertificateData: (params: CertificateDataParam) => void;
  children: ReactNode;
}

const StyleButton = styled(Button)`
  width: 120px;
`;

export const RangeProForm = ({
  formRef,
  postCertificateData,
  children
}: PropsInterface) => {
  const store = useStorage();
  const email = store.get('FIRST_LEVEL_STORAGE');
  const onFinish = async (values: Record<string, any>) => {
    const params = {
      email,
      periodFromToDate: values?.periodFromToDate
    };
    postCertificateData(params);
  };

  const onReset = () => {
    formRef.current?.resetFields();
  };

  const onSubmit = () => {
    formRef.current?.submit();
  };

  useEffect(() => {
    formRef.current?.setFieldValue('periodFromToDate', [
      dayjs().format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD')
    ]);
  }, []);

  return (
    <ProForm
      grid={true}
      formRef={formRef}
      submitter={false}
      rowProps={{
        gutter: 24
      }}
      onFinish={onFinish}
      initialValues={{
        periodFromToDate: [
          dayjs().format('YYYY-MM-DD'),
          dayjs().format('YYYY-MM-DD')
        ]
      }}
    >
      {children}
      <Col xl={8} md={12}>
        <ProForm.Item label=" " style={{ float: 'right' }}>
          <Space style={{ paddingLeft: '12px' }}>
            <StyleButton type="primary" ghost onClick={onReset}>
              {$t('Reset')}
            </StyleButton>
            <StyleButton type="primary" onClick={onSubmit}>
              {$t('Check Statistic')}
            </StyleButton>
          </Space>
        </ProForm.Item>
      </Col>
    </ProForm>
  );
};
