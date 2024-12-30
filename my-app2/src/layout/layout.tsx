import {useLocation, useNavigate} from 'react-router-dom';
import {SessionContext} from '../context/userSessions';
import { useContext, useEffect, useState} from 'react';
import { useRecoilValue } from 'recoil';
import { subjectsAtom } from '../atom/subject';
import { SocketContextType, useSocket } from '../context/socketProvider';
// import Navbar from '../components/navbar';

export default function Layout({children}: {children: React.ReactNode}): React.JSX.Element {

    const navigate = useNavigate();
    const {user} = useContext(SessionContext);
    const location = useLocation();
    const subjects = useRecoilValue(subjectsAtom);
    const {isReady}: SocketContextType = useSocket();
    const [bool1, setBool1] = useState<boolean>(false);
    const [bool2, setBool2] = useState<boolean>(false);
    const [link, setLink] = useState<string>('');

    useEffect(() => {
        const route = location.pathname;
        const key = route.split('/').pop();
        console.log("[layout]: key-", key);
        console.log("[layout]: route-", route);
        if (key === 'initial') {
            setBool1(false);
            setBool2(false);
        } else if (key === 'input') {
            setBool1(true);
            setBool2(true);
        } else if (key === 'thread') {
            setBool1(true);
            setBool2(true);
        } else if (key === 'profile') {
            setBool1(true);
            setBool2(false);
        } else {
            setBool1(true);
            setBool2(false);
            setLink(route);
            console.log("[layout]: link updated....", route);
        }
        console.log("[layout]: link updated...", {link});
    }, [location.pathname]);

    return (
        <div className='h-[100vh] w-[100vw] bg-blue-50'>
            <header className="relative top-0 left-0 flex justify-between items-center w-[100%] h-[8vh] border-[1px] border-solid border-black">
                <h1 className='absolute left-[2%] text-xl'><button onClick={()=>navigate("/initial")} className={bool1 ? 'hover:text-blue-500 underline' : 'hidden'}>Subjects</button> <span className={(!bool1 && !bool2) ? 'hidden' : 'text-xl'}>/</span> <button onClick={()=>navigate(`${link}`)} className={bool2 ? 'hover:text-blue-500 underline' : 'hidden'}>Community</button></h1>
                <button onClick={() => navigate(`/profile`)} className='absolute left-[95vw]'>
                    <img src={user?.image} alt="profile" className="w-[50px] h-[50px] rounded-full" />
                </button>
            </header>
            <div className="absolute top-[8vh] left-0 flex w-[10vw] h-[92vh] border-[1px]">
                <div className="flex flex-col w-[100%]">
                    <span className='w-[100%] absolute top-[10%] flex flex-col gap-y-5'>
                        {Object.entries(subjects).map(([subjectId, subject]) => (
                        <button onClick={() => navigate(`/${subjectId}/community`)} className='hover:bg-blue-100 bg-gray-200 w-[100%] h-[50px] border-[1px] border-solid border-black justify-center'><span className='text-xl'>{subject.subjectName}</span></button>
                        ))}
                    </span>
                </div>
            </div>
            <div className="flex absolute top-[8vh] left-[10vw] w-[90vw] h-[92vh] border-l-[1px] border-solid border-black overflow-y-auto">
                {isReady ? children : <div>Loading...</div>}
            </div>
        </div>
    );
}