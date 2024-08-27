import { Col, Space, Typography } from 'antd';

import { ReactNode } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import type {
  IDomEditor,
  IToolbarConfig,
  IEditorConfig
} from '@wangeditor/editor';
import '../index.less';

const { Text } = Typography;

interface ConfigEditorProps {
  label: string | ReactNode;
  value: string;
  onChange: (value: string) => void;
}
const ConfigEditor = (props: ConfigEditorProps) => {
  const { label, value, onChange } = props;
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [html, setHtml] = useState('');
  const $t = useTranslations();

  const lang = useAppSelector(selectLanguage);
  useEffect(() => {
    if (editor === null) return;
    editor.destroy();
    setEditor(null);
  }, [lang]);

  useEffect(() => {
    setHtml(value);
  }, [value]);

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: $t('Please enter you content')
  };
  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      'color',
      'bgColor',
      'bold',
      'italic',
      'underline',

      'justifyLeft',
      'justifyRight',
      'justifyCenter',
      'justifyJustify',

      'insertLink'
    ]
  };

  return (
    <Col>
      <Space direction="vertical" style={{ marginBottom: 20, width: '100%' }}>
        <Text color="#666869" strong={true}>
          {label}
        </Text>
        <Space className="editorContainer" direction="vertical">
          <Toolbar
            editor={editor}
            mode="default"
            defaultConfig={toolbarConfig}
          />
          <Editor
            defaultConfig={editorConfig}
            value={html}
            onCreated={setEditor}
            onChange={(editor) => {
              onChange(editor.getHtml());
            }}
            mode="default"
            style={{ height: '300px', overflowY: 'hidden', width: '100%' }}
          />
        </Space>
      </Space>
    </Col>
  );
};

export default ConfigEditor;
