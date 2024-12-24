import {v4 as uid} from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { SessionContext } from '../context/userSessions';
import {useParams} from 'react-router-dom';
import Layout from '../layout/layout';
import {useRecoilState} from 'recoil';
import {subjectsAtom} from '../atom/subject';
import {profile, subject} from '../interface';

export default function InitialPage() {

    const navigate = useNavigate();
    
    const [subjects, setSubjects] = useRecoilState(subjectsAtom);
    const {user} = useContext(SessionContext);
    const {sessionId} = useParams();

    const [blur, setBlur] = useState(false);
    const [subjectName, setSubjectName] = useState("");
    const [subjectDescription, setSubjectDescription] = useState("");

    useEffect(() => {
        if (user?.id !== sessionId) {
            navigate(`/login`);
        }
    }, [user, sessionId]);

    const handleAddSubject = () => {
        setBlur(!blur);

        const id_ = uid(); //subjectID genration

        //adding data to the database
        // fetch('http://localhost:3000/subjects', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         id: id_,
        //         name: "New Subject", 
        //         createdBy: user?.email, 
        //         description: "New Subject"
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // });

        const profile: profile = {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            id: user?.id || '',
            image: user?.image || null
        }
        
        const newSubject: subject = {
            subjectId: id_,
            subjectName: subjectName,
            subjectCreatedby: profile,
            subjectCreatedon: new Date().toISOString(),
            subjectMessages: [],
            subjectMedia: null,
            subjectDescription: subjectDescription,
            subjectCode: "New Subject"
        }

        setSubjects((prevSubjects) => ({
            ...prevSubjects,
            [id_]: newSubject
        }));

        setSubjectName('');
        setSubjectDescription('');
    }

    const handleSubjectClick = (subjectId: string) => {
        navigate(`/${sessionId}/${subjectId}`);
    }

    const handleDelete = (subjectId: string) => {
        setSubjects((prevSubjects) => {
            const updatedSubjects = {...prevSubjects};
            delete updatedSubjects[subjectId];
            return updatedSubjects;
        });
    }

    const handleBlurEffect = () => {
        setBlur(!blur);
    }

    return (
        <Layout>
            <div className='h-[100%] w-[100%] flex border-[1px] border-solid' style={{filter: !blur ? 'blur(0px)' : 'blur(6px)'}}>    
                <div className="absolute top-[2.5%] left-[2.5%] w-[75%] grid grid-cols-5 grid-rows-4 gap-5">
                    {Object.entries(subjects).map(([subjectId, subject]) => (
                        <div className="flex h-[200px] w-[200px] bg-gray-200 border-[1px] border-black">
                            <button onClick={() => handleSubjectClick(subjectId)} id={subjectId} className="h-[200px] w-[200px]">
                                <h1>{subject.subjectName}</h1>
                            </button>
                            <button onClick={() => handleDelete(subjectId)} className="z-10 border-[1px] border-black h-[20px] w-[20px] bg-red-500">
                                <img src="delete.png"/>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="absolute top-[80%] left-[85%]">
                    <button onClick={handleBlurEffect} className="fixed border-2 border-black h-[50px] w-[100px] bg-gray-200">Add Subject</button>
                </div>
            </div>
            {blur && 
            <div className="flex flex-col absolute top-[50%] left-[50%] h-[100%] w-[30%] bg-blue-50 " style={{filter: blur ? 'blur(0px)' : 'blur(10px)'}}>
                <input type="text" placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="relative top-[10%] left-[10%] border-2 border-black"/>
                <input type="text" placeholder="Subject Description" value={subjectDescription} onChange={(e) => setSubjectDescription(e.target.value)} className="relative top-[10%] left-[10%] border-2 border-black"/>
                <button onClick={handleAddSubject} className="relative top-[10%] left-[50%] border-2 border-black h-[50px] w-[100px] bg-gray-200">Add Subject</button>
            </div>}
        </Layout>
    );
}