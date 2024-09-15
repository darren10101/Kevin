import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { basicDark } from '@uiw/codemirror-theme-basic';

interface EditorProps {
  className?: string;
  lang: string;
  code: string;
  onChange: (value: string) => void;
}

const Editor = ({ className, lang, code, onChange }: EditorProps) => {  
  const handleChange = useCallback((value: string) => {
    onChange(value);
  }, []);

  return <>
    { lang === 'html' ? (
      <CodeMirror
        className={className}
        value={code}
        onChange={handleChange}
        extensions={[html()]}
        theme={basicDark}
      /> )
    :
      (<CodeMirror
        className={className}
        value={code}
        onChange={handleChange}
        extensions={[css()]}
        theme={basicDark}
      />)
    }
  </>;
}

export default Editor;