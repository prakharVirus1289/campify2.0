import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles (Snow theme)

function CustomTextEditor({input}: {input: string}) {

  // Custom toolbar options
  // const modules = {
  //   toolbar: [
  //     [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
  //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //     ['bold', 'italic', 'underline'],
  //     [{ 'align': [] }],
  //     ['link'],
  //     ['image'],
  //     ['blockquote'],
  //     [{ 'direction': 'rtl' }],
  //   ],
  // };

  return (
    <div id="editor-container">
      <ReactQuill
        value={input}
        theme="snow" 
        placeholder="question description here..."
        style={{ height: "200px", width: '700px' }} 
        readOnly={true}
      />
    </div>
  );
}

export default CustomTextEditor;