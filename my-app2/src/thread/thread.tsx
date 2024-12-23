import FileUploadComponent from '../thread/fileview';
import CodeInputBox from '../thread/codeview';
import {useLocation} from 'react-router-dom';
import {useNavigate, useParams} from 'react-router-dom';
import {SessionContext} from '../context/userSessions';
import { useContext, useEffect } from "react";
import Layout from '../layout/layout';

export default function Thread() {
    
    const {sessionId} = useParams();
    const {user} = useContext(SessionContext);
    const navigate = useNavigate();

    // http://localhost:5173/063b0bf0-de54-4358-84e0-8e1ea2b13716

    useEffect(() => {
        if ((sessionId !== user?.id)) {
            navigate('/login');
        }
    }, [user, sessionId]);

    const location = useLocation();
    const {title, description, code_, media} = location.state;

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
                <div className="flex p-20 border-[1px] border-solid border-black gap-2 justify-center">
                    <h1 className="text-2xl font-bold text-center">Input your comment</h1>
                    <div className="relative top-[70%] flex flex-col border-[1px] border-solid border-black p-2 rounded-md">
                        <input type="text" placeholder="Add a comment" className="border-[1px] border-solid border-black p-2 rounded-md" />
                        <button className="bg-blue-500 text-white p-2 rounded-md">Add</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}