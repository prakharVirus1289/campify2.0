import React, { useCallback, useEffect, useState } from "react";
import { MessageThread, MessageMain, subject } from "../interface";
import { io, Socket } from "socket.io-client";
import {useSetRecoilState, useRecoilState} from 'recoil';
import {mainMessagesAtom} from "../atom/mainMessage.tsx";
import {threadMessagesAtom} from "../atom/threadMessage.tsx";
import {subjectsAtom} from "../atom/subject.tsx";

interface ProviderProps {
    children: React.ReactNode;
}

export interface SocketContextType {
    sendSubject: (subject: subject) => void;
    sendMessageMain: (message: MessageMain) => void;
    sendMessageThread: (message: MessageThread) => void;
    isReady: boolean;
}

export const useSocket = () => {
    const context = React.useContext(SocketContext);
    if (context === null) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

const SocketContext = React.createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<ProviderProps> = ({children}) => {

    const setThreadMessages = useSetRecoilState(threadMessagesAtom);
    const [subjects, setSubjects] = useRecoilState(subjectsAtom);
    const [mainMessages, setMainMessages] = useRecoilState(mainMessagesAtom);
    const [isReady, setIsReady] = useState(false);
    console.log("atom subjects", subjects);
    console.log("atom mainMessages", mainMessages);
    const [socket, setSocket] = useState<Socket | null>(null);

    const sendSubject: SocketContextType["sendSubject"] = useCallback((subject: subject) => {
        if (socket) socket.emit("event:subject", subject);
    }, [socket]);

    const sendMessageMain: SocketContextType["sendMessageMain"] = useCallback((message: MessageMain) => {
        if (socket) socket.emit("event:messageMain", message);
    }, [socket]);

    const sendMessageThread: SocketContextType["sendMessageThread"] = useCallback((message: MessageThread) => {
        if (socket) socket.emit("event:messageThread", message);
    }, [socket]);

    const functionForMedia: (media: any) => Blob = (media: any) => {
        console.log("type of media", typeof media);
        console.log("media", media);
        const uint8Array = new Uint8Array(media.data);
        console.log("uint8Array", uint8Array);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        console.log("blob", blob);
        return blob;
    }

    const functionSubject = (message: any) => {
        // console.log("functionSubject_before", message);
        // console.log("functionSubject_after", message);
        const newSubject: subject = {
            subjectId: message.subjectId,
            subjectName: message.subjectName,
            subjectDescription: message.subjectDescription,
            subjectCode: message.subjectCode,
            subjectMedia: message.subjectMedia,
            subjectCreatedby: message.subjectCreatedby,
            subjectCreatedon: message.subjectCreatedon,
            subjectMessages: [],
        }
    
        setSubjects((prevSubjects) => ({...prevSubjects, [newSubject.subjectId]: newSubject}));
        console.log("state subjects updated->-----------------------");
    }

    const functionMain = (message: any) => {
        // console.log("functionMain", message);
        // console.log("atom subjects before before", subjects);

        functionForMedia(message.media);
        const newMainMessage: MessageMain = {
            messageId: message.messageId,
            title: message.title,
            description: message.description,
            code: {lang: message.codeLanguage, code: message.codeData},
            media: functionForMedia(message.media),
            createdby: message.createdby,
            createdon: message.createdon,
            threads: [],
        }
    
        setMainMessages((prevMainMessages) => ({...prevMainMessages, [newMainMessage.messageId]: newMainMessage}));
    
        console.log("atom subjects before", subjects);
        console.log("message.subjectId", message.subjectId);
        setSubjects((prevSubjects) => {
            // console.log("prevSubjects", prevSubjects);
            const subject = prevSubjects[message.subjectId];
            // console.log("subject inside setSubjects", subject);
            if (subject) {
                return {...prevSubjects, [message.subjectId]: {...subject, subjectMessages: [...subject.subjectMessages, newMainMessage.messageId]}};
            } 
            return prevSubjects;
        });

    }

    const functionThread = (message: any) => {
        
        console.log("functionThread", message);
        const newThreadMessage: MessageThread = {
            threadId: message.threadId,
            content: message.content,
            code: {lang: message.codeLanguage, code: message.codeData},
            media: message.media,
            createdby: message.createdby,
            createdon: message.createdon,
        }
    
        setThreadMessages((prevThreadMessages) => ({...prevThreadMessages, [newThreadMessage.threadId]: newThreadMessage}));
            
        setMainMessages( 
            (prevMainMessages) => {
                // console.log("prevMainMessages", prevMainMessages);
                const mainMessage = prevMainMessages[message.messageId];
                if (mainMessage) {
                    return {...prevMainMessages, [message.messageId]: {...mainMessage, threads: [...mainMessage.threads, newThreadMessage.threadId]}}
                }
                return prevMainMessages;
            }
        );

    }    
    
    const onMessageRec = (message: subject | MessageMain | MessageThread) => {
        console.log(message);
        if ("threadId" in message && "messageId" in message && "subjectId" in message) {
            console.log("messageThread");
            functionThread(message);
        } else if ("messageId" in message && "subjectId" in message) {
            console.log("messageMain");
            functionMain(message);
        } else if ("subjectId" in message) {
            console.log("subject");
            functionSubject(message);
        }
    }

    useEffect(() => {
        const _socket = io('http://localhost:3000');
        _socket.on('event:message', onMessageRec);
        _socket.emit('event:getMessages', {message: "hello"});
        console.log("[socketProvider]: socket message event:getMessages sent....");
        setSocket(_socket);

        return () => {
            _socket.disconnect();
            _socket.off('event:message', onMessageRec);
            setSocket(null);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => setIsReady(true), 5000); 
    }, []);

    return (
        <SocketContext.Provider value={{sendSubject, sendMessageMain, sendMessageThread, isReady}}>
            {isReady ? children : <div>Loading...</div>}
        </SocketContext.Provider>
    )
}