import {
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ModalForm,
  ProFormDateTimePicker,
  ProFormTextArea
} from '@ant-design/pro-components';
import { Flex, Typography, Space, Input } from 'antd';
import { CustomFormButton } from '@/components/proComponents';
import { MaintainScheduleJobItem, ScheduleJobInterface } from '../type';
import { modalProps } from '@/config/common';
import { getCommonOptions } from '@/services/common';
import { translationAllLabel } from '@/utils';
import { addOrUpdateScheduleJobApi } from '@/services/system-configurations';
const { Title } = Typography;
import './index.less';
import dayjs from 'dayjs';

type IProps = {
  isEdit: boolean;
  isOpen: boolean;
  job?: MaintainScheduleJobItem;
  onClose: () => void;
  setIsOpen: (value: boolean) => void;
};

const REPEAT_IND = {
  oneTime: 'N',
  cronExpression: 'Y'
};

const JOB_STATUS = {
  active: 'ACTIVE',
  disable: 'DISABLE'
};

const AddOrEdit = (props: IProps) => {
  const { isEdit, job, isOpen, setIsOpen } = props;
  const [loading, setLoading] = useState(false);
  const [switchBg, setSwitchBg] = useState(true);
  const [scheduleJobTypeOptions, setScheduleJobTypeOptions] = useState<
    LabelValue[]
  >([]);

  const [repeatIndValue, setRepeatIndValue] = useState('');
  const [form] = ProForm.useForm<ScheduleJobInterface>();

  const handleSave = (): void => {
    form?.validateFields().then((values: ScheduleJobInterface) => {
      setLoading(true);
      const params: ScheduleJobInterface = {
        id: job?.id,
        jobName: values.jobName,
        jobType: values.jobType,
        jobStatus: values.jobStatus,
        atTime: dayjs(values.atTime).format('YYYY-MM-DD HH:mm:ss'),
        frequency: values.frequency ?? null,
        parameters: values.parameters ?? '',
        repeatInd:
          values.repeatInd === 'oneTime'
            ? REPEAT_IND.oneTime
            : REPEAT_IND.cronExpression
      };
      addOrUpdateScheduleJobApi(params).then((res) => {
        setLoading(false);
        if (res.status.code === 0) {
          setIsOpen(false);
          notification.success({
            message: isEdit
              ? $t('Updated successfully')
              : $t('Added successfully'),
            placement: 'bottom'
          });
        }
      });
    });
  };

  useEffect(() => {
    if (!isOpen) {
      props.onClose();
      setRepeatIndValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit && job) {
      const {
        id,
        jobName,
        jobType,
        jobStatus,
        atTime,
        frequency,
        parameters,
        repeatInd
      } = job;
      form?.setFieldsValue({
        id,
        jobName,
        jobType,
        jobStatus,
        atTime,
        frequency,
        parameters,
        repeatInd
      });
      setSwitchBg(jobStatus === JOB_STATUS.active);
      setRepeatIndValue(
        repeatInd === REPEAT_IND.oneTime ? 'oneTime' : 'cronExpression'
      );
    } else {
      form?.setFieldValue('jobStatus', JOB_STATUS.active);
      setSwitchBg(true);
    }
  }, [isOpen, isEdit]);

  const frequencyOptions: LabelValue[] = [
    {
      label: $t('One Time'),
      value: 'oneTime'
    },
    {
      label: $t('Cron Expression'),
      value: 'cronExpression'
    }
  ];

  const getScheduleJobTypeOptions = async (): Promise<void> => {
    const data = await getCommonOptions({
      mstType: 'SCHEDULE_JOB_TYPE'
    });
    setScheduleJobTypeOptions(data);
  };

  useEffect(() => {
    getScheduleJobTypeOptions();
  }, []);

  const formTitle = (
    <Title level={4} className="text-center" style={{ margin: 20 }}>
      {isEdit
        ? `${$t('Update')} ${$t('Schedule Job')}`
        : `${$t('Add')} ${$t('Schedule Job')}`}
    </Title>
  );

  const formFooter = [
    <Flex key="footer" justify="end">
      <Space>
        <CustomFormButton
          key="back"
          ghost
          title={$t('Are you sure to discard the changes?')}
          okText={$t('Discard')}
          onConfirm={() => setIsOpen(false)}
        >
          {$t('Cancel')}
        </CustomFormButton>
        <CustomFormButton key="submit" loading={loading} onConfirm={handleSave}>
          {$t('Save')}
        </CustomFormButton>
      </Space>
    </Flex>
  ];

  return (
    <ModalForm
      className="schedule"
      grid
      form={form}
      title={formTitle}
      open={isOpen}
      submitter={{ render: () => formFooter }}
      modalProps={{
        ...modalProps,
        onCancel: () => setIsOpen(false)
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="jobName"
          colProps={{ md: 12, xl: 12 }}
          label={$t('Job Name')}
          rules={[
            {
              required: true,
              message: $t('Please Enter Job Name')
            }
          ]}
          fieldProps={{
            maxLength: 1000
          }}
        />

        <ProFormSelect
          colProps={{ md: 12, xl: 12 }}
          options={translationAllLabel(scheduleJobTypeOptions)}
          name="jobType"
          label={$t('Job Type')}
          rules={[
            {
              required: true,
              message: $t('Please Select Job Type')
            }
          ]}
        />
      </ProForm.Group>

      <ProFormTextArea
        name="parameters"
        label={$t('Parameters')}
        fieldProps={{
          maxLength: 4000,
          showCount: true
        }}
      />
      <ProFormSwitch
        fieldProps={{
          onChange: (val) => {
            setSwitchBg(val);
            form.setFieldValue(
              'jobStatus',
              val ? JOB_STATUS.active : JOB_STATUS.disable
            );
          },
          style: {
            backgroundColor: switchBg ? '#22a06b' : ''
          },
          checked: switchBg
        }}
        name="jobStatus"
        label={$t('Job Status')}
        checkedChildren={$t('Active')}
        unCheckedChildren={$t('Disable')}
      />
      <ProFormDateTimePicker
        name="atTime"
        label={$t('Schedule Date & Time')}
        rules={[
          {
            required: true,
            message: $t('Please Select Start Time')
          }
        ]}
      />

      <ProFormRadio.Group
        name="repeatInd"
        layout="vertical"
        label={$t('Frequency')}
        options={frequencyOptions}
        fieldProps={{
          value: repeatIndValue,
          onChange: (e) => {
            const { value } = e.target;
            form.setFieldValue('repeatInd', value);
            setRepeatIndValue(value);
          }
        }}
      />
      {repeatIndValue === 'cronExpression' ? (
        <ProForm.Item
          name="frequency"
          rules={[
            { required: true, message: $t('Please Enter Cron Expression') }
          ]}
          style={{ marginLeft: '25px', marginTop: '-24px' }}
        >
          <Input placeholder={$t('Please enter')} />
        </ProForm.Item>
      ) : null}
    </ModalForm>
  );
};
export default AddOrEdit;
