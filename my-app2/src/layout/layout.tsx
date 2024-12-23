import {useNavigate} from 'react-router-dom';
import {SessionContext} from '../context/userSessions';
import { useContext } from 'react';

export default function Layout({children}: {children: React.ReactNode}): React.JSX.Element {

    const navigate = useNavigate();
    const {user} = useContext(SessionContext);
    
    return (
        <div>
            <header className="relative top-0 left-0 flex justify-between items-center w-[100%] h-[7vh] border-[0.1px] border-solid border-black">
                <button onClick={() => navigate(-1)} className=''>back</button>
                <button onClick={() => navigate('/profile')} className='absolute left-[95vw]'>
                    <img src={user?.image} alt="profile" className="w-[50px] h-[50px] rounded-full" />
                </button>
            </header>
            <div className="absolute top-[7vh] left-0 flex w-[10vw] h-[93vh] border-[0.1px] border-solid border-black">
            </div>
            <div className="flex absolute top-[7vh] left-[10vw] w-[90vw] h-[93vh] border-[0.1px] border-solid border-black overflow-y-auto">
                {children}
            </div>
        </div>
    );
}