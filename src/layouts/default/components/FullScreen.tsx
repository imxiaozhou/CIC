import { Tooltip, Button } from 'antd';
import Icon from '@/components/Icons';
import { useFullscreen } from 'ahooks';

function FullScreenHeaderButton() {
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(() =>
    document.querySelector('html')
  );
  const [tooltipTitle, setTooltipTitle] = useState('');
  const lang = useAppSelector(selectLanguage);

  const fullScreenText = $t('Full Screen');
  const exitFullScreen = $t('Exit Full Screen');
  useEffect(() => {
    setTooltipTitle(isFullscreen ? exitFullScreen : fullScreenText);
  }, [isFullscreen, lang]);

  return (
    <Tooltip placement="bottom" title={tooltipTitle} arrow>
      <Button
        type="text"
        icon={
          !isFullscreen ? (
            <Icon type="FullscreenOutlined" />
          ) : (
            <Icon type="FullscreenExitOutlined" />
          )
        }
        onClick={toggleFullscreen}
      />
    </Tooltip>
  );
}

export default memo(FullScreenHeaderButton);
