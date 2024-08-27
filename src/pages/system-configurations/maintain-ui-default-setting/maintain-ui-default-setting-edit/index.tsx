import { Button, Card, Col, Divider, Flex, Row, Typography, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio
} from '@ant-design/pro-components';
import { Favorites } from '@/components/business';
import { CustomFormButton, CustomModal } from '@/components/proComponents';
import {
  getMaintainUiDefaultSettingDetail,
  submitMaintainUiDefaultSetting
} from '@/services/system-configurations';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel } from '@/utils';
import { submitMaintainUiDefaultDetailParams } from '@/services/system-configurations/maintain-ui-default-setting/type';
import CustomCancelButton from '@/components/proComponents/CustomCancelButton';

const { Title } = Typography;

const MaintainUiDefaultSettingEdit: React.FC = () => {
  const store = useStorage();
  const state = store.get('FIRST_LEVEL_STORAGE');

  const [form] = Form.useForm<submitMaintainUiDefaultDetailParams>();
  const navigator = useNavigate();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [themeOptions, setTheme] = useState<LabelValue[]>([]);
  const [fontSizeOptions, setFontSize] = useState<LabelValue[]>([]);
  const [dateFormatOptions, setDateFormatOptions] = useState<LabelValue[]>([]);
  const dispatch = useAppDispatch();

  const getThemeData = async () => {
    const res = await getCommonOptions({ mstType: 'UI_THEME_TYPE' });
    setTheme(res);
  };

  const getFontSizeData = async () => {
    const res = await getCommonOptions({ mstType: 'UI_FONT_SIZE' });
    setFontSize(res);
  };

  const getDateFormatData = async () => {
    const res = await getCommonOptions({ mstType: 'UI_DATE_FORMAT' });
    setDateFormatOptions(res);
  };

  const handleSubmitConfirm = async () => {
    const values = form.getFieldsValue();
    const result = await submitMaintainUiDefaultSetting({
      ...values,
      tntId: state?.tntId
    });
    if (result.status.code === 0) {
      dispatch(setDateFormat(values?.webApp?.dateFormat));
      notification.success({
        message: 'Submit Successfully'
      });
      navigator(-1);
    }
  };

  useEffect(() => {
    getThemeData();
    getFontSizeData();
    getDateFormatData();
  }, []);

  return (
    <>
      <Favorites
        code="FD-S-SYS-001"
        label={$t('Maintain UI Default Setting')}
      />
      <Card className="certificate-create">
        <Title level={5}>{$t('Maintain Appearance')}</Title>
        <ProForm
          form={form}
          params={{ id: '100' }}
          request={async () => {
            const data = await getMaintainUiDefaultSettingDetail({
              tntId: state?.tntId
            });
            return {
              ...data.data,
              tenantName: state?.tenantName
            };
          }}
          onFinish={handleSubmitConfirm}
          submitter={{
            render: (props) => {
              return (
                <Flex gap="small" style={{ justifyContent: 'end' }}>
                  <CustomCancelButton>{$t('Cancel')}</CustomCancelButton>
                  <Button onClick={() => props.form?.resetFields?.()}>
                    {$t('Reset')}
                  </Button>
                  <CustomFormButton
                    title="Confirm to submit?"
                    formInstance={props.form}
                    onConfirm={() => props.form?.submit?.()}
                  >
                    {$t('Submit')}
                  </CustomFormButton>
                </Flex>
              );
            }
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <ProFormText
                colProps={{ md: 12, xl: 8 }}
                name="tenantName"
                label={$t('Tenant Name')}
                disabled
              />
            </Col>
            <Col span={8}>
              <ProFormSelect
                colProps={{ xl: 8, md: 12 }}
                label={$t('Appearance')}
                name={['maintainAppearance', 'theme']}
                options={translationAllLabel(themeOptions)}
                rules={[
                  {
                    required: true,
                    message: $t('Please Select Appearance')
                  }
                ]}
              />
            </Col>
          </Row>
          <Divider />
          <Title level={5}>{$t('Web App')}</Title>
          <Row gutter={16}>
            <Col span={8}>
              <ProFormSelect
                colProps={{ xl: 8, md: 12 }}
                label={$t('Font Size')}
                name={['webApp', 'fontSize']}
                options={translationAllLabel(fontSizeOptions)}
                rules={[
                  {
                    required: true,
                    message: $t('Please Select Font Size')
                  }
                ]}
              />
            </Col>
            <Col span={8}>
              <ProFormSelect
                colProps={{ xl: 8, md: 12 }}
                label={$t('Date Format')}
                name={['webApp', 'dateFormat']}
                options={dateFormatOptions}
                rules={[
                  {
                    required: true,
                    message: $t('Please Select Date Format')
                  }
                ]}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <ProFormRadio.Group
                name={['webApp', 'language']}
                label={$t('Default Language')}
                options={[
                  {
                    label: $t('English'),
                    value: 'ENG'
                  },
                  {
                    label: $t('Traditional Chinese'),
                    value: 'TC'
                  },
                  {
                    label: $t('Simplified Chinese'),
                    value: 'SC'
                  }
                ]}
              />
            </Col>
          </Row>
          <Divider />
          <Title level={5}>{$t('Mobile App')}</Title>
          <Row gutter={16}>
            <Col span={8}>
              <ProFormSelect
                colProps={{ xl: 8, md: 12 }}
                label={$t('Font Size')}
                name={['mobileApp', 'fontSize']}
                options={translationAllLabel(fontSizeOptions)}
                rules={[
                  {
                    required: true,
                    message: $t('Please Select Font Size')
                  }
                ]}
              />
            </Col>
            <Col span={8}>
              <ProFormSelect
                colProps={{ xl: 8, md: 12 }}
                label={$t('Date Format')}
                name={['mobileApp', 'dateFormat']}
                options={dateFormatOptions}
                rules={[
                  {
                    required: true,
                    message: $t('Please Select Date Format')
                  }
                ]}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <ProFormRadio.Group
                name={['mobileApp', 'language']}
                label={$t('Default Language')}
                options={[
                  {
                    label: $t('English'),
                    value: 'ENG'
                  },
                  {
                    label: $t('Traditional Chinese'),
                    value: 'TC'
                  },
                  {
                    label: $t('Simplified Chinese'),
                    value: 'SC'
                  }
                ]}
              />
            </Col>
          </Row>
        </ProForm>
      </Card>
      <CustomModal
        open={isSubmitModalOpen}
        title={$t('UI Default Setting is saved successfully.')}
        type="info"
        onOk={() => setIsSubmitModalOpen(false)}
        onCancel={() => setIsSubmitModalOpen(false)}
      />
    </>
  );
};

export default MaintainUiDefaultSettingEdit;
