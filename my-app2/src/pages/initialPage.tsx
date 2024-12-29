import { useState } from 'react';
import {v4 as uid} from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SessionContext } from '../context/userSessions';
import { useEffect } from 'react';
import {useParams} from 'react-router-dom';
import Logout from '../components2/logout';
interface Subject {
    id: string;
    name: string;
}

export default function InitialPage() {

    const {user} = useContext(SessionContext);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const navigate = useNavigate();
    const {sessionId} = useParams();

    useEffect(() => {
        if (user?.id !== sessionId) {
            navigate(`/login`);
        }
    }, [user, sessionId]);

    const handleAddSubject = () => {
        const id_ = uid();
        fetch('http://localhost:3000/subjects', {
            method: 'POST',
            body: JSON.stringify({
                id: id_,
                name: "New Subject", 
                createdBy: user?.email, 
                description: "New Subject"
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        // console.log(response);
        setSubjects([...subjects, {id: id_, name: "New Subject"}]);
    }

    const handleSubjectClick = (subject: string) => {
        navigate(`/${user?.id}/${subject}`);
    }

    return (
        <div>
            <h1>Initial Page</h1>
            <button onClick={handleAddSubject} className="border-2 border-black h-[50px] w-[100px] bg-gray-200">Add Subject</button>
            <div className="grid grid-cols-6 grid-rows-6 gap-4">
                {subjects.map((subject) => (
                    <button onClick={() => handleSubjectClick(subject.id)} id={subject.id} className="border-2 border-black h-[250px] w-[250px] bg-gray-200">
                        <h1>{subject.name}</h1>
                    </button>
                ))}
            </div>
            <div className="absolute top-[80vh] right-[5vw]">
                <Logout/>
            </div>
        </div>

    );
}