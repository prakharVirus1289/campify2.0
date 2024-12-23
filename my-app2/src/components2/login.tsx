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
    <div id="login">
      <h1>Login</h1>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={handleLogin}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
}