import {GoogleLogout} from 'react-google-login';
import {SessionContext} from '../context/userSessions';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const clientId = "571515744262-babulumvica83kk8alpr0mbqmjqvk0uu.apps.googleusercontent.com";

export default function Logout() {
  const { user, setUser } = useContext(SessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if ((localStorage.getItem('sessionId') !== user?.id)) {
      navigate('/login');
    }
  }, [user]);

  const handleLogout = () => {
    console.log("Logout");
    setUser(null);
    localStorage.removeItem('sessionId');
    navigate('/login');
  }

  return (
    <div id="logout">
      <h1>Logout</h1>
      <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={handleLogout}
      />
    </div>
  );
}