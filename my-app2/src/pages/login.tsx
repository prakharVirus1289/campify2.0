import {GoogleLogin} from 'react-google-login';
import {SessionContext} from '../context/userSessions';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {User} from '../context/userSessions';
import { useNavigate } from 'react-router-dom';

const clientId = "571515744262-babulumvica83kk8alpr0mbqmjqvk0uu.apps.googleusercontent.com";

export default function Login() {

  const {setUser} = useContext(SessionContext);
  const navigate = useNavigate();

  const handleLogin = (response: any) => {
    console.log("logged in", response);

    const newUser: User = {
      first_name: response.profileObj.givenName,
      last_name: response.profileObj.familyName,
      email: response.profileObj.email,
      id: uuidv4(),
      image: response.profileObj.imageUrl
    }

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    navigate(`/${newUser.id}/initial`);
  }

  const handleLoginFailure = (error: any) => {
    console.log("failed to login", error);
    navigate('/login');
  }

  return (
    <div id="login" className='flex items-center justify-center h-[100vh] w-[100vw]'>
      <div className='h-[100vh] w-[40vw] absolute left-[60vw] border-[1px] border-solid border-black'>
        <div className="h-[50vh] w-[20vw] absolute top-[30vh] left-[10vw] border-[1px] border-solid border-black items-center justify-center flex flex-col gap-40">
          <h1 className='text-2xl font-bold text-center underline'>Please Login to continue</h1>
          <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={handleLogin}
            onFailure={handleLoginFailure}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      </div>
      <div className='h-[100vh] w-[60vw] absolute left-[0vw] border-[1px] border-solid border-black bg-blue-200'>
        <h1 className='text-7xl font-bold absolute top-[10vh] left-[20vw] z-10'>Campify</h1>
        <img src="img.webp" alt="camping" className='h-[70vh] w-[60vw] object-cover blur-sm'/>
      </div>
    </div>
  );
}