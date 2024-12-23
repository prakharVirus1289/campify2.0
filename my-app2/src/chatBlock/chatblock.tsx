import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {SessionContext} from '../context/userSessions';
import { useContext } from "react";

interface code {
    lang: string;
    code: string;
}

interface ChatBlockProps {
    title: string;
    description: string;
    code_: code;
    media: File | null;
    id: string;
}

export default function ChatBlock({title, description, code_, media, id}: ChatBlockProps): React.JSX.Element {

  const navigate = useNavigate();
  const {sessionId} = useParams();
  const {subjectId} = useParams();
  const {user} = useContext(SessionContext);

  if ((sessionId !== user?.id)) {
    navigate('/login');
  }

  const handleClick = () => {
    console.log('clicked');
    navigate(`/${sessionId}/${subjectId}/${id}/thread`, {state: {title: title, description: description, code_: code_, media: media}});
  }

  return (
    <button onClick={handleClick} className="flex relative w-[100%] p-10 border-[0.1px] border-solid border-black gap-2">
      <div className='flex flex-col w-[100vw] gap-y-2'>
        <div className="flex">
            <h1 className="text-2xl ">{title}</h1>
        </div>
        <div className="flex text-m">
            <div dangerouslySetInnerHTML={{ __html: description }}/>
        </div>
      </div>
    </button>
  );
}

