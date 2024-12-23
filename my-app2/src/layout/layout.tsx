import {useNavigate} from 'react-router-dom';
import {SessionContext} from '../context/userSessions';
import { useContext } from 'react';
// import Navbar from '../components/navbar';

export default function Layout({children}: {children: React.ReactNode}): React.JSX.Element {

    const navigate = useNavigate();
    const {user} = useContext(SessionContext);
    
    return (
        <div className='h-[100vh] w-[100vw] bg-blue-50'>
            <header className="relative top-0 left-0 flex justify-between items-center w-[100%] h-[8vh] border-[1px] border-solid border-black">
                {/* <button onClick={() => navigate(-1)} className=''>back</button> */}
                <button onClick={() => navigate(`/${user?.id}/profile`)} className='absolute left-[95vw]'>
                    <img src={user?.image} alt="profile" className="w-[50px] h-[50px] rounded-full" />
                </button>
                {/* <Navbar/> */}
            </header>
            <div className="absolute top-[8vh] left-0 flex w-[10vw] h-[92vh] border-[1px] border-solid border-black">
            </div>
            <div className="flex absolute top-[8vh] left-[10vw] w-[90vw] h-[92vh] border-[1px] border-solid border-black overflow-y-auto">
                {children}
            </div>
        </div>
    );
}