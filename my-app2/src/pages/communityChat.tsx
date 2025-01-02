import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from '../context/userSessions';
import { useContext } from "react";
import Chatblock from '../chatBlock/chatblock';

import Layout from "../layout/layout";
import { subjectsAtom } from "../atom/subject";
import { mainMessagesAtom } from "../atom/mainMessage";

import { Input } from "antd";
import Fuse from 'fuse.js';

export default function CommunityChat() {
    const { Search } = Input;
    const subjects = useRecoilValue(subjectsAtom);
    const messages = useRecoilValue(mainMessagesAtom);
    const [messages_show, setMessages_show] = useState(messages);
    const navigate = useNavigate();
    const { subjectId } = useParams();
    const { user } = useContext(SessionContext);

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

    const handleSearch = (value: string) => {
        if (!value.trim()) {
            setMessages_show(messages);
            return;
        }

        const options = {
            keys: ['title', 'description'],
            threshold: 0.4,
            findAllMatches: true,
            distance: 90,
        };
        const messagesArray = Object.values(messages);
        const fuse = new Fuse(messagesArray, options);

        const result = fuse.search(value);
        const filteredMessages = result.reduce((acc: Record<string, any>, { item }) => {
            acc[item.messageId] = item;
            return acc;
        }, {});
        setMessages_show(filteredMessages);
    };

    return (
        <Layout>
            <div className="h-[100%] w-[100%] flex flex-col my-3">
                <h1 className="text-2xl text-center">Community Chat</h1>
                <Search placeholder="Search Messages" className="w-[70vw] mx-auto my-7" onChange={(e) => { handleSearch(e.target.value) }} />
                <button onClick={addMessage} className="fixed top-[20vh] left-[90vw] bg-blue-500 text-white p-2 rounded-md">
                    <div>add message</div>
                </button>
                <div className="absolute top-[10vh] left-[5vw] w-[70vw] h-[80vh] mt-10 overflow-y-auto">
                    {messagesIds.map((messageId) => {
                        var message = messages_show[messageId];
                        if (message) {
                            return (<Chatblock key={messageId} title={message.title} description={message.description} id={messageId} />)
                        }
                        return null;
                    })}
                </div>
            </div>
        </Layout>
    );
}