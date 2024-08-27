import { useEffect } from 'react';
import { Space, Button } from 'antd';
import styled from 'styled-components';
import Icon from '@/components/Icons';
import type { TagMultipleProps } from '@/types/proComponents';

const StyleItem = styled.span`
  display: inline-flex;
  padding: 6px 16px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
`;

const TagMultiple = ({
  items = [],
  size = 'small',
  onChange
}: TagMultipleProps) => {
  const [tags, setTags] = useState(items);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  useEffect(() => {
    setTags(items);
  }, [items]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag.value !== removedTag);
    setTags(newTags);
    onChange(newTags);
  };
  return (
    <Space size={size} wrap>
      {tags.map((tag, index) => (
        <StyleItem
          key={tag.value}
          style={{
            backgroundColor: isDarkMode ? '#7f91a7' : '#e0e8f1'
          }}
        >
          <Space>
            {tag.label}
            <Button
              type="text"
              shape="circle"
              icon={<Icon type="CloseOutlined" />}
              size="small"
              onClick={() => handleClose(tag.value)}
            />
          </Space>
        </StyleItem>
      ))}
    </Space>
  );
};

export default TagMultiple;
