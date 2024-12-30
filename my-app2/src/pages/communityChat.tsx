import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {SessionContext} from '../context/userSessions';
import { useContext } from "react";
import Chatblock from '../chatBlock/chatblock';

import Layout from "../layout/layout";
import { subjectsAtom } from "../atom/subject";
import { mainMessagesAtom } from "../atom/mainMessage";

export default function CommunityChat() {

    const subjects = useRecoilValue(subjectsAtom);
    const messages = useRecoilValue(mainMessagesAtom);
    const navigate = useNavigate();
    const {subjectId} = useParams();
    const {user} = useContext(SessionContext);

    let messagesIds: string[] = [];
    
    console.log("[communityChat]: subjects-", subjects);

    if (subjectId) {
        console.log("[communityChat]: subjects[subjectId]-", subjects[subjectId]);
        messagesIds = subjects[subjectId].subjectMessages;
        console.log("[communityChat]: messagesIds-", messagesIds);
    }

    console.log(messagesIds);

    useEffect(() => {
        if ((localStorage.getItem('sessionId') !== user?.id)) {
            console.log("[communityChat]: not logged in");
            console.log("[communityChat]: sessionId-", localStorage.getItem('sessionId'));
            console.log("[communityChat]: user-", user?.id);
          navigate('/login');
        }
    }, [user]);

    const addMessage = () => {
        navigate(`/${subjectId}/input`);
    }

    return (
        <Layout>
            <div className="h-[100%] w-[100%] flex flex-col">
                <button onClick={addMessage} className="fixed top-[12.5vh] left-[90vw] bg-blue-500 text-white p-2 rounded-md">
                    <div>add message</div>
                </button>
                <div className="absolute top-[5vh] left-[5vw] w-[70vw] h-[80vh]">
                    {messagesIds.map((messageId) => {
                        const message = messages[messageId];
                        return (<Chatblock key={messageId} title={message.title} description={message.description} id={messageId}/>)
                    })}
                </div>
            </div>
        </Layout>
    );
}