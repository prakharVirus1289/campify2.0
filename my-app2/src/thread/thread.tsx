import FileUploadComponent from '../thread/fileview';
import CodeInputBox from '../thread/codeview';
import {useLocation} from 'react-router-dom';
import {useNavigate, useParams} from 'react-router-dom';
import {SessionContext} from '../context/userSessions';
import { useContext, useEffect, useState } from "react";
import Layout from '../layout/layout';
import { useRecoilState } from 'recoil';
import { mainMessagesAtom } from '../atom/mainMessage';
// import { MessageThread, profile } from '../interface';
import { threadMessagesAtom } from '../atom/threadMessage';
import { v4 as uuidv4 } from 'uuid';
import { SocketContextType, useSocket } from '../context/socketProvider';

export default function Thread() {
    
    const {sessionId, messageId, subjectId} = useParams();
    const {user} = useContext(SessionContext);
    const [mainMessages] = useRecoilState(mainMessagesAtom);
    const [threadMessages] = useRecoilState(threadMessagesAtom);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const {sendMessageThread}: SocketContextType = useSocket();

    useEffect(() => {
        if ((sessionId !== user?.id)) {
            navigate('/login');
        }
    }, [user, sessionId]);

    const location = useLocation();
    const {title, description, code_, media} = location.state;

    let threadIDs: string[] = [];
    if (messageId) {
        threadIDs = mainMessages[messageId].threads;
    }

    // const userProfile: profile = {
    //     first_name: user?.first_name || '',
    //     last_name: user?.last_name || '',
    //     email: user?.email || '',
    //     id: user?.id || '',
    //     image: user?.image || null,
    // };

    const handleAdd = () => {

        const newThread: any = {
            threadId: uuidv4(),
            messageId: messageId,
            subjectId: subjectId,
            content: message,
            codeData: "",
            codeLanguage: "javascript",
            media: file || null,
            createdby: "user",
            createdon: new Date().toISOString(),
        };

        sendMessageThread(newThread);

        // setThreadMessages((prevThreadMessages) => ({
        //     ...prevThreadMessages,
        //     [newThread.threadId]: newThread,
        // }));

        // if (messageId) {
        //     setMainMessages((prevMainMessages) => ({
        //         ...prevMainMessages,
        //         [messageId]: {
        //             ...prevMainMessages[messageId],
        //             threads: [newThread.threadId, ...prevMainMessages[messageId].threads],
        //         },
        //     }));
        // }
    }

    return (
        <Layout>
            <div className="flex flex-col space-y-4 p-10 pl-60">
                <div className="flex flex-col p-5 border-[1px] border-solid border-black gap-2 justify-center">
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-bold text-center">{title}</h1>
                    </div>
                    <div className="w-[50vw] flex justify-center items-center">
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                    {code_ && (<div className="flex justify-center items-center">
                        <CodeInputBox input={code_} />
                    </div>)}
                    {media && (<div className="flex flex-col justify-center items-center">
                        <FileUploadComponent object={media} />
                    </div>)}
                </div>
                <div id="input-box" className="flex flex-col p-10 border-[1px] border-solid border-black gap-10 justify-center">
                    <h1 className="text-2xl font-bold text-center">Input your comment</h1>
                    <div className="flex flex-col h-[400px] border-[1px] border-solid border-black p-2 rounded-md">
                        <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Add a comment" className="border-[1px] border-solid border-black p-2 rounded-md h-[75%] w-[100%]" />
                        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="border-[1px] border-solid border-black p-2 rounded-md h-[15%] w-[100%]" />
                        <button onClick={handleAdd} className="bg-blue-500 text-white p-2 rounded-md h-[10%] w-[100%]">Add</button>
                    </div>
                </div>
                <div className="flex flex-col p-10 border-[1px] border-solid border-black gap-10 justify-center">
                    <h1 className="text-2xl font-bold text-center">Comments</h1>
                    {threadIDs.map((threadId) => {
                        const thread = threadMessages[threadId];
                        return (<div key={threadId}>
                            <p>{thread.content}</p>
                        </div>)
                    })}
                </div>
            </div>
        </Layout>
    );
}