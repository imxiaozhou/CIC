import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Favorites } from '@/components/business';
import Icon from '@/components/Icons';
import { CustomProTableTheme } from '@/components/proComponents';
import { STY_MARGUNBOTTOM } from '@/pages/user-management/approve-certificate-enrolment/utils';
import {
  ProCard,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormInstance
} from '@ant-design/pro-components';
import { detailManageMessage } from '@/services/message-management/enquire-message-usage-statistics';
import { RangeProForm } from '../components/range-proform';
import { RangeProformContent } from '../components/range-proform-content';
import { MessageUsageDetailsColumns, StarAndEndDateInterface } from '../type';

const MessageUsageDetail = () => {
  const navigation = useNavigate();
  const formRef = useRef<ProFormInstance<any>>();
  const [columnsState, setColumnsState] =
    useState<MessageUsageDetailsColumns>();

  const columns: ProDescriptionsItemProps[] = [
    {
      key: '1',
      title: $t('No. of Success Message Sent'),
      children: columnsState?.successMessageSent
    },
    {
      key: '2',
      title: $t('No. of Success Message Received'),
      children: columnsState?.successMessageReceived
    },
    {
      key: '3',
      title: $t('No. of Failed Message Sent'),
      children: columnsState?.failedMessageSent
    },
    {
      key: '4',
      title: $t('No. of Failed Message Received'),
      children: columnsState?.failedMessageReceived
    },
    {
      key: '5',
      title: $t('Total Size of Message'),
      children: columnsState?.totalSize
    }
  ];

  const postCertificateData = async (params: StarAndEndDateInterface) => {
    const { data } = await detailManageMessage({
      ...params
    });
    setColumnsState(data);
  };

  const backClick = () => {
    navigation(-1);
  };

  return (
    <CustomProTableTheme>
      <Favorites
        code="FD-S-MSG-002"
        label={$t('Enquire Message Usage Statistics')}
      />
      <ProCard
        title={$t('Message Period Range')}
        bordered={false}
        style={STY_MARGUNBOTTOM}
      >
        <RangeProForm
          formRef={formRef}
          postCertificateData={postCertificateData}
        >
          <RangeProformContent />
        </RangeProForm>
      </ProCard>

      <ProCard
        title={$t('Message Usage Details')}
        bordered={false}
        extra={
          <Button
            ghost
            type="primary"
            icon={<Icon type="LeftOutlined" />}
            style={{ float: 'right' }}
            onClick={backClick}
          >
            {$t('Back')}
          </Button>
        }
      >
        <ProDescriptions
          column={1}
          labelStyle={{
            justifyContent: 'flex-start',
            width: 280
          }}
          columns={columns}
        />
      </ProCard>
    </CustomProTableTheme>
  );
};

export default MessageUsageDetail;
