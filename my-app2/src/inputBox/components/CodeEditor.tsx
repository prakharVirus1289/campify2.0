import React, {Dispatch, SetStateAction, useState} from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-monokai'; // Theme example

import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/mode-python';

interface code {
  lang: string;
  code: string;
}

interface MyComponentProps {
  setValue: Dispatch<SetStateAction<code>>;
}

function CodeInputBox({setValue}: MyComponentProps) {
  const [selectedOption, setselectedOption] = useState('javascript');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setselectedOption(e.target.value);
    console.log(selectedOption);
  };

  const [code, setCode] = useState(`// Write your code here`);

  const codeChange = (code: string) => {
    setCode(code);
    setValue({lang: selectedOption, code: code});
  }

  return (
    <div id="input-box" className = "absolute top-[3vh] left-[38vw]">
      <select value={selectedOption} onChange={handleChange}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c_cpp">C/C++</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="ruby">Ruby</option>
        <option value="php">PHP</option>
        <option value="json">JSON</option>
        <option value="xml">XML</option>
        <option value="sql">SQL</option>
        <option value="markdown">Markdown</option>
        <option value="bash">Bash</option>
        <option value="typescript">TypeScript</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="kotlin">Kotlin</option>
        <option value="swift">Swift</option>
      </select>
      <AceEditor
        mode={selectedOption}
        theme="monokai"
        onChange={codeChange}
        value={code}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        width="30vw"
        height="62vh"
      />
    </div>
  );
}

export default CodeInputBox;
