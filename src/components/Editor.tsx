import '@wangeditor/editor/dist/css/style.css';
import type {
  IDomEditor,
  IToolbarConfig,
  IEditorConfig
} from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { theme, Button } from 'antd';

const { useToken } = theme;

function MyEditor() {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [html, setHtml] = useState('<p>hello</p>');
  const [isShow, setShow] = useState(false);

  const { token } = useToken();

  const lang = useAppSelector(selectLanguage);

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setHtml('<p>hello&nbsp;<strong>world</strong>.</p>\n<p><br></p>');
    }, 1500);
  }, []);

  const toolbarConfig: Partial<IToolbarConfig> = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...'
  };

  useEffect(() => {
    if (editor === null) return;
    editor.destroy();
    setEditor(null);
  }, [lang]);

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div>
        <Button type="primary" onClick={() => setShow(true)}>
          发送
        </Button>
      </div>
      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
          zIndex: 100,
          marginTop: '15px',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: `1px solid ${token.colorBorder}` }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '600px' }}
        />
      </div>
      <div style={{ marginTop: '15px' }}>{isShow && html}</div>
    </>
  );
}

export default MyEditor;
