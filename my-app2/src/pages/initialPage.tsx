import {v4 as uid} from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { SessionContext } from '../context/userSessions';
import Layout from '../layout/layout';
import {useRecoilState} from 'recoil';
import {subjectsAtom} from '../atom/subject';
// import {profile, subject} from '../interface';
import { SocketContextType, useSocket } from '../context/socketProvider';

export default function InitialPage() {

    const navigate = useNavigate();
    const {sendSubject}: SocketContextType = useSocket();
    const [subjects, setSubjects] = useRecoilState(subjectsAtom);
    const {user} = useContext(SessionContext);

    const [blur, setBlur] = useState(false);
    const [subjectName, setSubjectName] = useState("");
    const [subjectDescription, setSubjectDescription] = useState("");

    useEffect(() => {
        if (localStorage.getItem('sessionId') !== user?.id) {
            navigate(`/login`);
        }
    }, [user]);

    const handleAddSubject = () => {
        setBlur(!blur);

        const id_ = uid(); //subjectID genration
        
        const newSubject: any = {
            subjectId: id_,
            subjectName: subjectName,
            subjectDescription: subjectDescription,
            subjectCode: "New Subject",
            subjectMedia: null,
            subjectCreatedby: "user",
            subjectCreatedon: new Date().toISOString(),            
        }

        sendSubject(newSubject);
        setSubjectName('');
        setSubjectDescription('');
    }

    const handleSubjectClick = (subjectId: string) => {
        navigate(`/${subjectId}/community`);
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
                        <div className="flex h-[200px] w-[200px] bg-gray-100 border-[1px] border-black">
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