import { Card, Typography, Flex, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Favorites } from '@/components/business';
import { CustomModal } from '@/components/proComponents';

import AddUser from '../components/AddUser';
import { FormatTemplateItem, INotificationForm, TemplateItems } from '../type';
import TagsMultipleItem from '../components/TagsMultipleItem';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel } from '@/utils';
import { SendAdHocNotificationProps } from '@/services/notification-management/send-ad-hoc-notification/type';
import { sendAdHocNotificationApi } from '@/services/notification-management/send-ad-hoc-notification';
import { getTemplateListApi } from '@/services/notification-management';
import {
  ProForm,
  ProFormCheckbox,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-components';
import { range } from 'lodash-es';
import CustomCancelButton from '@/components/proComponents/CustomCancelButton';

const { Title } = Typography;

const ApprovePage = () => {
  const userInfo = useAppSelector(selectUserInfo);
  const store = useStorage();
  const state = store.get('FIRST_LEVEL_STORAGE');

  const [successVisible, setSuccessVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [sendTypeOptions, setSendTypeOptions] = useState<LabelValue[]>([]);
  const [form] = ProForm.useForm<INotificationForm>();
  const [temList, setTemList] = useState<FormatTemplateItem[]>([]);
  const [timePickerDisable, setTimePickerDisable] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LabelValue[]>([]);
  const [dateRule, setDateRule] = useState([
    {
      required: true,
      message: $t('Please Select Send Date & Time')
    }
  ]);
  const navigate = useNavigate();

  const getSendType = async () => {
    const options = await getCommonOptions({
      mstType: 'NOTIFICATION_SEND_TYPE'
    });
    setSendTypeOptions(options);
  };

  const getCurTemplate = (template: FormatTemplateItem) => {
    const { tmplContent, value } = template;
    form.setFieldsValue({
      notificationTemplate: value,
      notificationContent: tmplContent
    });
  };

  const getTemplates = async () => {
    const res = await getTemplateListApi();
    const data: FormatTemplateItem[] = res.data.map((d: TemplateItems) => ({
      label: d.tmplName,
      value: d.ntfcTmplId,
      tmplContent: d.tmplContent
    }));
    getCurTemplate(data[0]);
    setTemList(data);
  };

  useEffect(() => {
    getSendType();
    getTemplates();
    setSelectedUser(state);
  }, []);

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    let params: SendAdHocNotificationProps = {
      ntfcSenderId: userInfo.userId as string,
      ntfcRcptId: values.selectedUsers.map((i: LabelValue) => i.value),
      ntfcType: values.sendType,
      ntfcTmplId: Number(values.notificationTemplate),
      ntfcContent: values.notificationContent,
      sendImmdtInd: values.sendImmediately ? 'Y' : 'N',
      schdSendDt: values.sendImmediately
        ? ''
        : dayjs(values.sendTime).format('YYYY-MM-DD HH:mm:ss')
    };
    sendAdHocNotificationApi(params).then((res) => {
      if (res.status.code === 0) {
        setSuccessVisible(true);
      }
    });
  };

  const handleTemplateChange = (e: string) => {
    const target = temList?.find((template) => template.value === e);
    getCurTemplate(target as unknown as FormatTemplateItem);
  };

  const handleImmediatelyChecked = (e: { target: { checked: boolean } }) => {
    form.setFieldValue('sendImmediately', e.target.checked);
    setTimePickerDisable(e.target.checked);
    if (e.target.checked) {
      form.setFieldValue('sendTime', null);
      setDateRule([]);
    } else {
      setDateRule([
        {
          required: true,
          message: $t('Please Select Send Date & Time')
        }
      ]);
    }
  };

  const disabledDate = (current: {
    isBefore: (arg0: dayjs.Dayjs, arg1: string) => any;
  }) => {
    return current?.isBefore(dayjs(), 'day');
  };

  const disabledTime = (
    selectedDate: string | number | Date | dayjs.Dayjs | null | undefined
  ) => {
    // 获取当前时间
    const currentTime = dayjs();

    // 如果选择的日期是今天
    if (dayjs(selectedDate).isSame(currentTime, 'day')) {
      // 禁用当前时间之前的小时、分钟和秒
      return {
        disabledHours: () => {
          const currentHour = currentTime.hour();
          return range(0, currentHour).map((hour) => hour);
        },
        disabledMinutes: (selectedHour: number) => {
          if (selectedHour === currentTime.hour()) {
            const currentMinute = currentTime.minute();
            return range(0, currentMinute).map((minute) => minute);
          }
          return []; // 对于非当前小时，不限制分钟
        },
        disabledSeconds: (selectedHour: number, selectedMinute: number) => {
          if (
            selectedHour === currentTime.hour() &&
            selectedMinute === currentTime.minute()
          ) {
            const currentSecond = currentTime.second();
            return range(0, currentSecond).map((second) => second);
          }
          return []; // 对于非当前小时和分钟，不限制秒
        }
      };
    }

    // 如果选择的日期不是今天，则不限制时间
    return {};
  };

  const uniqueArrayByValue = (arr: LabelValue[]): LabelValue[] => {
    const valueSet = new Set();
    return arr.filter((item) => {
      if (!valueSet.has(item.value)) {
        valueSet.add(item.value);
        return true;
      }
      return false;
    });
  };

  const handleCheck = () => {
    form?.validateFields().then((values: INotificationForm) => {
      const targetTime = dayjs(values.sendTime);

      const currentTime = dayjs();

      // 非立即发送时，选择的时间必须晚于当前时间
      if (!values.sendImmediately && !targetTime.isAfter(currentTime)) {
        setWarningVisible(true);
      } else {
        setConfirmVisible(true);
      }
    });
  };

  return (
    <>
      <Favorites code="FD-S-NTM-003" label={$t('Send Ad-Hoc Notification')} />
      <Card>
        <Flex justify="space-between" style={{ marginBottom: '16px' }}>
          <Title level={4}>{$t('Send Ad-Hoc Notification')}</Title>
          <AddUser
            handleSelectUser={(user: LabelValue[]) => {
              const selectedUsers = form.getFieldValue('selectedUsers');
              let uniqueMap = uniqueArrayByValue([...selectedUsers, ...user]);
              form.setFieldValue('selectedUsers', uniqueMap);
              setSelectedUser(uniqueMap);
            }}
          />
        </Flex>

        <ProForm
          form={form}
          initialValues={{
            selectedUsers: state
          }}
          submitter={false}
          grid={true}
        >
          <ProForm.Item
            label=""
            name="selectedUsers"
            style={{ width: '100%' }}
            rules={[
              {
                required: true,
                message: $t('Please Select Users')
              }
            ]}
          >
            <TagsMultipleItem value={selectedUser} form={form} />
          </ProForm.Item>
          <ProForm.Group>
            <ProFormSelect
              label={$t('Send Type')}
              name="sendType"
              rules={[
                {
                  required: true,
                  message: $t('Please Select Send Type')
                }
              ]}
              options={translationAllLabel(sendTypeOptions)}
              colProps={{ xl: 12 }}
            />
            <ProFormSelect
              label={$t('Notification Template')}
              name="notificationTemplate"
              rules={[
                {
                  required: true,
                  message: $t('Please Select Notification Template')
                }
              ]}
              options={temList}
              colProps={{ xl: 12 }}
              onChange={handleTemplateChange}
            />
          </ProForm.Group>
          <ProFormTextArea
            label={$t('Notification Content')}
            name="notificationContent"
            style={{ width: '100%' }}
            rules={[
              {
                required: true,
                max: 300,
                message: $t('Please Enter Notification Content')
              }
            ]}
            fieldProps={{
              showCount: true,
              maxLength: 300
            }}
          />

          <ProFormCheckbox
            label=""
            name="sendImmediately"
            style={{ width: '100%' }}
            fieldProps={{ onChange: handleImmediatelyChecked }}
          >
            {$t('Send Immediately')}
          </ProFormCheckbox>
          <ProForm.Group>
            <ProFormDateTimePicker
              disabled={timePickerDisable}
              label={$t('Send Date & Time')}
              name="sendTime"
              rules={dateRule}
              colProps={{ xl: 12 }}
              fieldProps={{
                disabledDate: disabledDate as any,
                disabledTime,
                showTime: { defaultValue: dayjs('00:00:00', 'HH:mm:ss') }
              }}
            />
          </ProForm.Group>
        </ProForm>

        <Flex justify="flex-end">
          <Space>
            <CustomCancelButton>{$t('Cancel')}</CustomCancelButton>
            <Button type="primary" onClick={handleCheck}>
              {$t('Send')}
            </Button>
          </Space>
        </Flex>

        <CustomModal
          open={successVisible}
          title={$t('Ad-hoc Notification is sent successfully')}
          type="info"
          okText={$t('Ok')}
          onOk={() => navigate(-1)}
          onCancel={() => setSuccessVisible(false)}
        />
        <CustomModal
          open={confirmVisible}
          title={$t('Are you sure to Send?')}
          type="warning"
          okText={$t('Confirm')}
          onOk={handleSubmit}
          onCancel={() => setConfirmVisible(false)}
        />
        <CustomModal
          open={warningVisible}
          title={$t('Send Date & Time should be future date and time.')}
          type="warning"
          okText={$t('Ok')}
          onOk={() => setWarningVisible(false)}
          onCancel={() => setWarningVisible(false)}
        />
      </Card>
    </>
  );
};

export default ApprovePage;
