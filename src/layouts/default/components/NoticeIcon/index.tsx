import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  MenuProps,
  Typography,
  Badge,
  Dropdown
} from 'antd';
import Icon from '@/components/Icons';
import {
  getNotificationsList,
  setNotificationsIsRead
} from '@/services/layouts';
import { NotificationsListResponse } from '@/services/layouts/notification/type';
import NoticesModal from './NoticesModal';
import { dataItemI, iconItems } from './type';
import './index.less';

const { Text, Title } = Typography;

const NoticesListItem = ({
  data,
  itemClick
}: {
  data: dataItemI;
  itemClick: any;
}) => {
  const { title, content, isRead, notificationTemplateType } = data;
  let currentIcon = iconItems.find(
    (item) => item.type === notificationTemplateType
  );

  return (
    <Button
      className="notices-items"
      type="text"
      onClick={() => itemClick(data)}
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: 10,
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        width: '100%',
        height: '55px',
        overflow: 'hidden'
      }}
    >
      <Flex>
        <Avatar
          size={24}
          draggable={false}
          gap={0}
          style={{
            background: currentIcon?.background,
            fontSize: 16,
            marginRight: 12,
            minWidth: 24
          }}
          icon={
            <Icon
              type={currentIcon?.icon}
              style={{ color: currentIcon?.color }}
            />
          }
        />
        <Flex vertical>
          <Flex>
            <Title level={5} style={{ marginRight: 10 }}>
              {title}
            </Title>
            {isRead === 'N' && (
              <Badge
                color="red"
                dot
                style={{ position: 'absolute', right: 10 }}
                styles={{ indicator: { width: 8, height: 8 } }}
              />
            )}
          </Flex>
          <Text
            ellipsis={true}
            style={{
              fontSize: 14,
              color: '#666869',
              maxWidth: 240,
              textAlign: 'left'
            }}
          >
            {content}
          </Text>
        </Flex>
      </Flex>
    </Button>
  );
};

const NoticesDropdown: React.FC = () => {
  const [data, setData] = useState<dataItemI[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isViewAll, setIsViewAll] = useState<boolean>();
  const [itemData, setItemData] = useState<NotificationsListResponse>();
  const [unReadNum, setUnReadNum] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageNum, setCurrentPageNum] = useState<number>(5);
  const userInfo = useAppSelector(selectUserInfo);

  const getDataSource = async () => {
    const { data, unReadNum } = await getNotificationsList({
      userId: userInfo?.userId,
      pageNum: 1,
      pageSize: 5
    });
    setUnReadNum(unReadNum as number);
    return {
      data: data || []
    };
  };

  const OpenNotifications = async () => {
    setOpen(true);
    setIsViewAll(true);
    setCurrentPage(1);
    setCurrentPageNum(5);
  };

  let items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <Flex
          className="notifications-header"
          justify="space-between"
          align="center"
        >
          <Title level={5} style={{ marginBottom: 0 }}>
            {$t('Notifications')}
          </Title>
          <Button
            type="link"
            onClick={OpenNotifications}
            style={{ paddingRight: 0 }}
          >
            {$t('View All')}
          </Button>
        </Flex>
      )
    }
  ];

  const itemClick = async (item: any) => {
    setOpen(true);
    setItemData(item);
    setIsViewAll(false);
    await setNotificationsIsRead({
      userId: userInfo?.userId,
      ids: [item?.id],
      isRead: 'Y'
    });
    initData();
  };

  for (let i = 0; i < data.length; i++) {
    items.push({
      key: i + 1,
      label: <NoticesListItem data={data[i]} itemClick={itemClick} />
    });
  }

  const initData = async () => {
    const { data } = await getDataSource();
    setData(data);
  };

  const onIsViewAllChange = (value: boolean) => setIsViewAll(value);

  const onItemDataChange = (value: any) => setItemData(value);

  const onCacheUnReadNum = (value: number) => setUnReadNum(value);

  const onCacheCurrentPage = (value: number) => setCurrentPage(value);

  const onCacheCurrentPageNum = (value: number) => setCurrentPageNum(value);

  useEffect(() => {
    let timer: any;
    initData();
    timer = setInterval(() => {
      initData();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Dropdown
        overlayClassName="notices-dropdown"
        menu={{ items }}
        autoAdjustOverflow
        getPopupContainer={(dom) => dom.parentElement! || document.body}
        placement="bottomRight"
        arrow
        className="notices-container"
        overlayStyle={{ maxWidth: 320, maxHeight: 100 }}
      >
        <Button
          type="text"
          size="large"
          className="toolbar-item-hover"
          icon={
            <Badge
              size="small"
              count={unReadNum}
              offset={[3, 0]}
              style={{ boxShadow: 'none', fontSize: 12, lineHeight: 1 }}
            >
              <Icon type="BellOutlined" />
            </Badge>
          }
        />
      </Dropdown>
      <NoticesModal
        isViewAll={isViewAll}
        currentItemData={itemData}
        open={open}
        onCancel={() => setOpen(false)}
        onIsViewAllChange={onIsViewAllChange}
        onItemDataChange={onItemDataChange}
        onCacheUnReadNum={onCacheUnReadNum}
        currentPage={currentPage}
        onCacheCurrentPage={onCacheCurrentPage}
        currentPageNum={currentPageNum}
        onCacheCurrentPageNum={onCacheCurrentPageNum}
      />
    </>
  );
};

export default NoticesDropdown;
