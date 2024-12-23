import React, { Dispatch, SetStateAction, useState } from 'react';
import FileViewer from 'react-file-viewer';

interface MyComponentProps {
    setValue: Dispatch<SetStateAction<File | null>>;
}

export default function FileUploadComponent({setValue}: MyComponentProps){
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>('pdf');
  const [fileUrl, setFileUrl] = useState<string>('');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      console.log(uploadedFile);
      setFile(uploadedFile);
      setFileType(uploadedFile.type.split('/')[1]); // Extract file type (e.g., 'pdf', 'docx')
      const fileUrl = URL.createObjectURL(uploadedFile); // Create URL for the file object
      setFileUrl(fileUrl); // Set the file URL state
      setValue(uploadedFile);
    }
  };

  const onError = (e: any) => {
    console.error("Error loading the file:", e);
  };

  return (
    <div className='absolute top-[35vh] left-[0] h-[250px]'>
      <input type="file" onChange={onFileChange} className='w-[700px] h-[50px] border-2 border-gray-300 rounded-md p-2' />
      {file && (  
        <FileViewer
          fileType={fileType} // Specify the file type like 'pdf' or 'docx'
          filePath={fileUrl}  // Pass the object URL of the file
          onError={onError}   // Handle errors
          style={{   
            width: '100px',
            height: '300px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}
    </div>
  );
}