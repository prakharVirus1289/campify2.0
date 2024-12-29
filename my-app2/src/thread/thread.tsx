import FileUploadComponent from '../thread/fileview';
import CodeInputBox from '../thread/codeview';
import {useLocation} from 'react-router-dom';
import {useNavigate, useParams} from 'react-router-dom';
import {SessionContext} from '../context/userSessions';
import { useContext, useEffect } from "react";

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
        <div className="flex flex-col space-y-4 p-10 pl-60">
            <div className="flex flex-col p-10 border-[1px] border-solid border-black gap-2 justify-center">
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
                <h1 className="text-2xl font-bold text-center">Comments</h1>
            </div>
        </div>
    );
}