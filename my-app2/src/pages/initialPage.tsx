import {v4 as uid} from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SessionContext } from '../context/userSessions';
import { useEffect } from 'react';
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

    useEffect(() => {
        if (user?.id !== sessionId) {
            navigate(`/login`);
        }
    }, [user, sessionId]);

    const handleAddSubject = () => {
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
            subjectName: "New Subject",
            subjectCreatedby: profile,
            subjectCreatedon: new Date().toISOString(),
            subjectMessages: [],
            subjectMedia: null,
            subjectDescription: "New Subject",
            subjectCode: "New Subject"
        }

        setSubjects((prevSubjects) => ({
            ...prevSubjects,
            [id_]: newSubject
        }));
    }

    const handleSubjectClick = (subjectId: string) => {
        navigate(`/${sessionId}/${subjectId}`);
    }

    return (
        <Layout>
            <div className='h-[100vh] w-[100vw]'>                
                <div className="relative top-[2.5vh] left-[2.5vw] w-[75vw] grid grid-cols-5 grid-rows-4 gap-5">
                    {Object.entries(subjects).map(([subjectId, subject]) => (
                        <button onClick={() => handleSubjectClick(subjectId)} id={subjectId} className="border-[1px] border-black h-[200px] w-[200px] bg-gray-200">
                            <h1>{subject.subjectName}</h1>
                        </button>
                    ))}
                </div>
                <div className="absolute top-[80vh] right-[5vw]">
                    <button onClick={handleAddSubject} className="fixed border-2 border-black h-[50px] w-[100px] bg-gray-200">Add Subject</button>
                </div>
            </div>
        </Layout>
    );
}