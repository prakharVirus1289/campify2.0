import { Dispatch, SetStateAction, useState } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles (Snow theme)

interface MyComponentProps {
    setValue: Dispatch<SetStateAction<string>>;
}

function CustomTextEditor({setValue}: MyComponentProps) {
  const [editorValue, setEditorValue] = useState('');

  const handleChange = (value: string) => {
    setEditorValue(value);
    setValue(value);
  };

  // Custom toolbar options
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      ['link'],
      ['image'],
      ['blockquote'],
      [{ 'direction': 'rtl' }],
    ],
  };

  return (
    <div id="editor-container" className="absolute top-[10vh] left-[0]">
      <ReactQuill
        value={editorValue}
        onChange={handleChange} 
        modules={modules} 
        theme="snow" 
        placeholder="question description here..."
        style={{ height: "200px", width: '700px' }} 
      />
    </div>
  );
}

export default CustomTextEditor;
