import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai'; // Theme example

interface code {
  lang: string;
  code: string;
}

function CodeInputBox ({input}: {input: code}) {

  return (
    <div id="input-box">
      <AceEditor
        mode={input.lang}
        theme="monokai"
        value={input.code}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        width="700px"
        height="300px"
        readOnly={true}
      />
    </div>
  );
}

export default CodeInputBox;