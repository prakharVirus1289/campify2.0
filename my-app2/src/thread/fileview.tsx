import FileViewer from 'react-file-viewer';

interface MyComponentProps {
    object: File | null;
}

export default function FileUploadComponent({object}: MyComponentProps){

  const onError = (e: any) => {
    console.error("Error loading the file:", e);
  };

  return (
    <div id="file-container" className="flex flex-col items-left justify-left overflow-y-auto h-[200px] w-[700px]">
      {object && (
        <FileViewer
          fileType={object.type.split('/')[1]} // Specify the file type like 'pdf' or 'docx'
          filePath={URL.createObjectURL(object)}  // Pass the object URL of the file
          onError={onError}   // Handle errors
          style={{   
            width: '100px',
            height: '300px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
          readOnly={true}
        />
      )}
    </div>
  );
}