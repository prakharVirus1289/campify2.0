import {useEffect, useState } from 'react';
import CodeInputBox from '../components/CodeEditor';
import CustomTextEditor from '../components/TextEditor';
import FileUploadComponent from '../components/fileViewer';
import {mainMessagesAtom} from '../../atom/mainMessage';
import {useSetRecoilState} from 'recoil';
import { useNavigate } from 'react-router-dom';
import Layout from "../../layout/layout";
import { useParams } from 'react-router-dom';
import {SessionContext} from '../../context/userSessions';
import { useContext } from 'react';
import { uid } from 'uid';
import { MessageMain, profile} from '../../interface';
import { subjectsAtom } from '../../atom/subject';
import { useRecoilState } from 'recoil';
interface code {
  lang: string;
  code: string;
}

export default function InputBox() {

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [code, setCode] = useState<code>({lang: 'javascript', code: ''});
  const [media, setMedia] = useState<File | null>(null);
  const setMessages = useSetRecoilState(mainMessagesAtom);
  const [subjects, setSubjects] = useRecoilState(subjectsAtom);
  const navigate = useNavigate();
  const {subjectId, sessionId} = useParams();
  const {user} = useContext(SessionContext);

  useEffect(() => {
    if ((sessionId !== user?.id)) {
      navigate('/login');
    }
  }, [user, sessionId]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (title === '' || description === '') {
      return;
    }

    const id_ = uid();

    // const formData = new FormData();
    // formData.append('id', id__);
    // formData.append('title', title);
    // formData.append('content', description);
    // formData.append('code', code.code);
    // formData.append('code_language', code.lang);
    // if (media) {
    //   formData.append('media', media);
    // }
    // formData.append('subject_ID', sessionId || '');
    // formData.append('createdBy', user?.email || '');

    // fetch("http://localhost:3000/m_messages", {
    //   method: "POST",
    //   body: formData,
    // });

    const profile: profile = {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      id: user?.id || '',
      image: user?.image || null
    }
    
    const newMessage: MessageMain = {
      messageId: id_,
      title: title,
      description: description,
      code: code,
      media: media,
      createdby: profile,
      createdon: new Date().toISOString(),
      threads: []
    };

    setMessages((prevMessages) => ({
      ...prevMessages,
      [newMessage.messageId]: newMessage
    }));

    console.log(subjects);
    console.log(subjectId);

    if (subjectId) {
      setSubjects((prevSubjects) => ({
        ...prevSubjects,
        [subjectId]: {
          ...prevSubjects[subjectId],
          subjectMessages: [...prevSubjects[subjectId].subjectMessages, newMessage.messageId]
        }
      }));
    }

    navigate(`/${sessionId}/${subjectId}`);
  }

  return (
    <Layout>
      <div>
        <h2 className="absolute top-[5vh] left-[42vw] text-2xl font-bold">Input</h2>
        <form action="http://localhost:3000/m_messages" method="post" encType="multipart/form-data">
          <div id="input-container" className="h-[70vh] w-[70vw] bg-gray-100 border-[2px] border-black-300 absolute top-[10vh] left-[10vw] flex">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='absolute top-[5vh] left-[0] w-[700px] h-[50px] border-2 border-gray-300 rounded-md p-2' placeholder='question title here...'/>
            <CustomTextEditor setValue={setDescription}/>
            <CodeInputBox setValue={setCode}/>
            <FileUploadComponent setValue={setMedia}/>
          </div>
          <button onClick={handleClick} type="submit" className='w-[200px] absolute top-[82vh] left-[37vw] bg-blue-500 text-white p-2 rounded-md'>post to community</button>
        </form>
      </div>
    </Layout>
  );
};