import { Typography, Card, Button, Flex, Form } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  ProForm,
  ProFormDatePicker,
  ProFormText,
  ProFormSelect
} from '@ant-design/pro-components';
import {
  CustomFormButton,
  CustomModal,
  CustomProTableTheme
} from '@/components/proComponents';
import { Favorites } from '@/components/business';
import { CertCreate } from '@/services/user-management/maintain-user-certificate/type';
import { sava } from '@/services/user-management';
import { getCommonOptions } from '@/services/common';
const { Title, Text } = Typography;

const RenderLabel = (label: string) => {
  return <Text style={{ color: '#666869' }}>{$t(label)}</Text>;
};

export default function CertificateCreate() {
  const [form] = Form.useForm<CertCreate>();
  const navigateTo = useNavigate();
  const store = useStorage();
  const userInfo = useAppSelector(selectUserInfo);
  const { state, certType, record, certCreateType } = store.get(
    'SECOND_LEVEL_STORAGE'
  );

  const { tenantName, displayName, emailAddress, tenantCode } = state;

  const formatTime = 'YYYY-MM-DD';
  const [isShow, setIsShow] = useState(false);
  // const [loading, setLoading] = useState(false);
  // default：create正常validTo要-1d；renew即record有值, 设置valid from 是valid to 加1日
  // 5.28 renew，如果日期是Expired，即certStatusLabel=Expired，使用今天作为开始日期
  const isValid = record?.certStatusLabel !== 'Expired';
  const validFromDefault = (date?: string) => {
    return record
      ? dayjs(date).add(1, 'day').format(formatTime)
      : dayjs(date).format(formatTime);
  };
  const validToDefault = (date?: string, y = 1) => {
    return record
      ? dayjs(date).add(y, 'y').format(formatTime)
      : dayjs(date).add(y, 'y').subtract(1, 'day').format(formatTime);
  };
  // change：入参：开始日期，月份数
  const validToChange = (date?: string, m = 12) => {
    return dayjs(date).add(m, 'month').subtract(1, 'day').format(formatTime);
  };
  // 初始化forms，renew时有record

  const [forms] = useState<CertCreate>({
    issueToCn: displayName,
    issueToE: emailAddress,
    issueToOu1: record ? record?.issueToOu1 : tenantName,
    issueToOu2: record ? record?.issueToOu2 : 'Hong Kong SAR Government',
    issueToOu3: record ? record?.issueToOu3 : tenantCode,
    issueToOu4: '',
    issueToO: certType === 'RM' ? 'DPO UAT g-Cert(CN)' : 'DPO UAT e-Cert(CN)',
    issueToL: record ? record?.issueToL : 'Hong Kong',
    issueToS: record ? record?.issueToS : 'Hong Kong',
    issueToC: record ? record?.issueToC : 'HK',
    validMonth: record?.validMonth ?? '12', // record没有返回，写1年
    validFrom: isValid ? validFromDefault(record?.validTo) : validFromDefault(),
    validTo: isValid ? validToDefault(record?.validTo) : validToDefault()
  });
  const [locateLGroupOpts, setLocateLGroupOpts] = useState<LabelValue[]>();
  const [stateProvinceSOpts, setStateProvinceSOpts] = useState<LabelValue[]>();
  const [regionOpts, setRegionOpts] = useState<LabelValue[]>();
  const [validYearOpts, setValidYearOpts] = useState<LabelValue[]>();

  const handleCancel = () => {
    navigateTo(-1);
  };
  const handleClose = () => {
    setIsShow(false);
    navigateTo(-1);
  };

  const handleConfirm = async () => {
    const formData = form.getFieldsValue();
    let param = Object.keys(formData).length === 0 ? forms : formData;
    param = {
      ...param,
      issueToOu1: param?.issueToOu1?.trim(),
      issueToOu2: param?.issueToOu2?.trim(),
      issueToO: param?.issueToO?.trim(),
      userId: state?.userId,
      certType,
      creBy: userInfo?.userId, // login的userid   1
      updBy: userInfo?.userId, // login的userid   1
      apprStatus: record ? 'PENDING_APPR_RENEW' : 'PENDING_APPR_CREATE', // PENDING_APPR_RENEW | PENDING_APPR_CREATE
      verNo: 1
    };
    const res = await sava(param);
    if (res?.status?.code === 0) {
      setIsShow(true);
    }
  };
  const changeValidYear = (val: any) => {
    const validFrom = form.getFieldValue('validFrom');
    const validTo = val ? validToChange(validFrom, val) : undefined;
    form.setFieldsValue({ validTo });
  };
  const changeValidFrom = (_: any, val: any) => {
    const validMonth = form.getFieldValue('validMonth');
    const validTo = val ? validToChange(val, validMonth) : undefined;
    const validFrom = val ? dayjs(val).format(formatTime) : undefined;
    form.setFieldsValue({ validTo, validFrom });
  };

  const getOptions = async (type: string) => {
    let options;
    switch (type) {
      case 'CERTIFICATE_LOCATE_L':
        options = await getCommonOptions({ mstType: type });
        setLocateLGroupOpts(options);
        break;
      case 'CERTIFICATE_STATE_S':
        options = await getCommonOptions({ mstType: type });
        setStateProvinceSOpts(options);
        break;
      case 'CERTIFICATE_COUNTRY_C':
        options = await getCommonOptions({ mstType: type });
        setRegionOpts(options);
        break;
      case 'CERTIFICATE_VALID_MONTH':
        // todo 这里待改成月份的
        options = await getCommonOptions({ mstType: type });
        setValidYearOpts(options);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    getOptions('CERTIFICATE_LOCATE_L');
    getOptions('CERTIFICATE_STATE_S');
    getOptions('CERTIFICATE_COUNTRY_C');
    getOptions('CERTIFICATE_VALID_MONTH');
  }, []);

  return (
    <CustomProTableTheme>
      <Favorites code="FD-S-USR-005" label={$t('Maintain User Certificate')} />
      <Card className="certificate-create">
        <Title level={4}>{$t('Certificate Details')}</Title>
        <Text>
          {certCreateType === 'create'
            ? $t('New Application')
            : $t('Renewal Application')}
        </Text>
        <Title level={5}>{$t('Issue to')}</Title>
        <ProForm
          form={form}
          grid
          params={{ id: '100' }}
          initialValues={forms}
          submitter={{
            render: (props) => {
              return [
                <Flex key="footer" justify="end">
                  <Button
                    style={{ marginRight: 8 }}
                    ghost
                    type="primary"
                    onClick={handleCancel}
                  >
                    {$t('Cancel')}
                  </Button>
                  <CustomFormButton
                    formInstance={props.form}
                    onConfirm={handleConfirm}
                    title={$t('Confirm to submit?')}
                  >
                    {$t('Submit')}
                  </CustomFormButton>
                </Flex>
              ];
            }
          }}
        >
          <ProFormText
            colProps={{ md: 12, xl: 8 }}
            name="issueToCn"
            label={RenderLabel('Common name (CN)')}
            placeholder="HKID Full Name"
            rules={[
              {
                required: true,
                message: `${$t('Please Input')} ${$t('Common name (CN)')}`
              }
            ]}
          />
          <ProFormText
            colProps={{ md: 12, xl: 16 }}
            name="issueToE"
            label={RenderLabel('Email Address')}
            readonly
          />
          <ProFormText
            colProps={{ md: 12, xl: 16 }}
            name="issueToOu1"
            label={RenderLabel('Organisational Name (OU)')}
            readonly
          />
          <ProFormText
            colProps={{ md: 12, xl: 8 }}
            name="issueToOu2"
            label={RenderLabel('Unit Name (OU)')}
            readonly
          />
          <ProFormText
            colProps={{ md: 12, xl: 8 }}
            name="issueToOu3"
            label={RenderLabel('Tenant ID (OU)')}
            readonly
          />
          <ProFormText
            colProps={{ md: 12, xl: 8 }}
            name="issueToOu4"
            label={RenderLabel('Identify ID (OU)')}
            readonly
          />
          <ProFormText
            colProps={{ md: 12, xl: 8 }}
            name="issueToO"
            label={RenderLabel('Organisation (O)')}
            readonly
          />

          <ProFormSelect
            colProps={{ xl: 8, md: 12 }}
            label={RenderLabel('Locate (L)')}
            name="issueToL"
            fieldProps={{
              options: locateLGroupOpts
            }}
            rules={[
              {
                required: true,
                message: `${$t('Please Select')} ${$t('Locate (L)')}`
              }
            ]}
          />
          <ProFormSelect
            colProps={{ xl: 8, md: 12 }}
            label={RenderLabel('State/Province (S)')}
            name="issueToS"
            fieldProps={{
              options: stateProvinceSOpts
            }}
            rules={[
              {
                required: true,
                message: `${$t('Please Select')} ${$t('State/Province (S)')}`
              }
            ]}
          />
          <ProFormSelect
            colProps={{ xl: 8, md: 12 }}
            label={RenderLabel('Country/Region (C)')}
            name="issueToC"
            fieldProps={{
              options: regionOpts
            }}
            rules={[
              {
                required: true,
                message: `${$t('Please Select')} ${$t('Country/Region (C)')}`
              }
            ]}
          />
          <ProFormSelect
            colProps={{ xl: 8, md: 12 }}
            label={RenderLabel('Valid Month')}
            name="validMonth"
            fieldProps={{
              options: validYearOpts,
              onChange: changeValidYear
            }}
            rules={[
              {
                required: true,
                message: `${$t('Please Select')} ${$t('Valid Year')}`
              }
            ]}
          />
          <ProFormDatePicker
            colProps={{ xl: 8, md: 12 }}
            width="lg"
            name="validFrom"
            label={RenderLabel('Valid From')}
            fieldProps={{
              onChange: changeValidFrom
            }}
            rules={[
              {
                required: true,
                message: `${$t('Please Select')} ${$t('Valid From')}`
              }
            ]}
          />
          <ProFormDatePicker
            colProps={{ xl: 8, md: 12 }}
            name="validTo"
            label={RenderLabel('Valid To')}
            readonly
          />
        </ProForm>
      </Card>
      <CustomModal
        open={isShow}
        title={$t('Your submission is pending to approve.')}
        type="info"
        onOk={handleClose}
        onCancel={handleClose}
      />
    </CustomProTableTheme>
  );
}
