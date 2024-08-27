import {
  Avatar,
  Badge,
  Flex,
  Input,
  Modal,
  ModalProps,
  Typography
} from 'antd';
import Icon from '@/components/Icons';
import { modalProps, pagination } from '@/config/common';
import { ProList } from '@ant-design/pro-components';
import {
  getNotificationsList,
  setNotificationsIsRead
} from '@/services/layouts';
import { NotificationsListResponse } from '@/services/layouts/notification/type';
import { debounce } from 'lodash-es';
import NoticesItem from './NoticesItem';
import './index.less';
import { iconItems } from './type';
import { formatExpiration } from '@/utils';

const { Title, Text } = Typography;

type CustomModalProps = ModalProps & {
  onCancel: () => void;
  currentItemData?: NotificationsListResponse;
  isViewAll: boolean | undefined;
  onIsViewAllChange: (value: boolean) => void;
  onItemDataChange: (value: NotificationsListResponse) => void;
  onCacheUnReadNum: (value: number) => void;
  currentPage: number;
  onCacheCurrentPage: (value: number) => void;
  currentPageNum: number;
  onCacheCurrentPageNum: (value: number) => void;
};

const NoticesModal: React.FC<CustomModalProps> = (props) => {
  const {
    currentItemData,
    isViewAll,
    onIsViewAllChange,
    onItemDataChange,
    onCacheUnReadNum,
    currentPage,
    currentPageNum,
    onCacheCurrentPage,
    onCacheCurrentPageNum
  } = props;
  const userInfo = useAppSelector(selectUserInfo);
  const actionRef = useRef<any>();
  const [keyword, setKeyword] = useState<string>('');

  const getDataSource = async (params: any) => {
    onCacheCurrentPage(params.current);
    onCacheCurrentPageNum(params.pageSize);
    const { data, total } = await getNotificationsList({
      userId: userInfo?.userId,
      keyword,
      pageNum: params.current,
      pageSize: params.pageSize
    });
    return {
      data,
      total
    };
  };

  const handleSearch = useCallback(
    debounce(() => {
      actionRef?.current?.reload();
    }, 800),
    []
  );

  useEffect(() => {
    handleSearch();
  }, [keyword, handleSearch]);

  const getUnReadNotificationsCount = async () => {
    const { unReadNum } = await getNotificationsList({
      userId: userInfo?.userId,
      pageNum: 1,
      pageSize: 5
    });

    onCacheUnReadNum(unReadNum as number);
  };

  const onItemClick = async (record: any) => {
    onIsViewAllChange(false);
    onItemDataChange(record);
    await setNotificationsIsRead({
      userId: userInfo?.userId,
      ids: [record?.id],
      isRead: 'Y'
    });

    // 更新未读通知数量
    getUnReadNotificationsCount();
  };

  const modalCancel = () => {
    onIsViewAllChange(true);
    props.onCancel?.();
    onCacheCurrentPage(0);
    onCacheCurrentPageNum(5);
    setKeyword('');
  };

  return (
    <Modal
      {...modalProps}
      {...props}
      className="notices-modal"
      title={
        <Title level={4} style={{ textAlign: 'center' }}>
          {$t('Notifications')}
        </Title>
      }
      footer={false}
      width={992}
      onCancel={modalCancel}
    >
      {isViewAll ? (
        <>
          <Flex justify="center" vertical align="center">
            <Input
              allowClear
              className="toolbar_font"
              placeholder={$t('Please search')}
              prefix={<Icon type="SearchOutlined" />}
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
          </Flex>
          <ProList
            rowKey="id"
            rowClassName="notification-item"
            style={{
              maxHeight: 450,
              overflowY: 'scroll'
            }}
            request={getDataSource}
            pagination={{
              ...pagination,
              pageSizeOptions: [5, 10, 20, 50, 100],
              defaultPageSize: currentPageNum,
              current: currentPage
            }}
            actionRef={actionRef}
            showActions="hover"
            onRow={(record) => {
              return {
                onClick: () => onItemClick(record)
              };
            }}
            metas={{
              title: {
                dataIndex: 'title',
                render(text, row: any) {
                  return (
                    <>
                      <Text>{row.title}</Text>
                      {row.isRead === 'N' && (
                        <Badge
                          color="red"
                          dot
                          style={{ position: 'absolute', right: 0 }}
                          styles={{ indicator: { width: 8, height: 8 } }}
                        />
                      )}
                    </>
                  );
                }
              },
              avatar: {
                dataIndex: 'icon',
                render(_, row: any) {
                  let currentIcon = iconItems.find(
                    (item) => item.type === row.notificationTemplateType
                  );
                  return (
                    <Avatar
                      size={24}
                      draggable={false}
                      gap={0}
                      style={{
                        background: currentIcon?.background,
                        fontSize: 16,
                        lineHeight: '20px'
                      }}
                      icon={
                        <Icon
                          type={currentIcon?.icon}
                          style={{ color: currentIcon?.color }}
                        />
                      }
                    />
                  );
                },
                search: false
              },
              description: {
                dataIndex: 'subTitle',
                search: false,
                render: (text, row: any) => {
                  return (
                    <Flex justify="space-between">
                      <Text ellipsis style={{ color: '#666869' }}>
                        {row.content}
                      </Text>
                      <Text style={{ minWidth: 200, marginLeft: 30 }}>
                        {formatExpiration(row.date, 'MMMM D, YYYY HH:mm')}
                      </Text>
                    </Flex>
                  );
                }
              }
            }}
          />
        </>
      ) : (
        <NoticesItem
          data={currentItemData}
          onBack={() => onIsViewAllChange(true)}
        />
      )}
    </Modal>
  );
};

export default NoticesModal;
