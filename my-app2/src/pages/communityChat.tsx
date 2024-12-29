import { messagesAtom } from "../atom/messagesAtom";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { useEffect, useId } from "react";
import { useParams } from "react-router-dom";
import {SessionContext} from '../context/userSessions';
import { useContext } from "react";
import Logout from '../components2/logout';

export default function CommunityChat() {
    
    const messages = useRecoilValue(messagesAtom);
    const messages_ = messages.messages;
    const navigate = useNavigate();
    const {sessionId} = useParams();
    const {user} = useContext(SessionContext);

    useEffect(() => {
        if ((sessionId !== user?.id)) {
          navigate('/login');
        }
    }, [user, sessionId]);

    const addMessage = () => {
        navigate(`/${sessionId}/${user?.id}/input`);
    }

    return (
        <div className="h-[100vh] w-[90vw] flex flex-col overflow-y-auto">
            <button onClick={addMessage} className="fixed top-[12.5vh] left-[90vw] bg-blue-500 text-white p-2 rounded-md">
                <div>add message</div>
            </button>
            <div className="absolute top-[5vh] left-[5vw] w-[70vw] h-[80vh]">
                {messages_.map((msg) => {
                    const id = useId();
                    return (<div key={id}>{msg}</div>)
                })}
            </div>
            <div className="absolute top-[80vh] left-[80vw]">
                <Logout/>
            </div>
        </div>
    );
}