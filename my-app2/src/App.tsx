import './index.css';
import InputBox from './inputBox/pages/inputBox';
import Login from './pages/login';
import Logout from './components/logout';
import { Route, Routes } from 'react-router-dom';
import CommunityChat from './pages/communityChat';
import {gapi} from 'gapi-script';
import { useEffect } from 'react';
import Thread from './thread/thread';
import InitialPage from './pages/initialPage';
import Profile from './pages/profile';

const clientId = "571515744262-babulumvica83kk8alpr0mbqmjqvk0uu.apps.googleusercontent.com";

const App: React.FC = () => {

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        clientId: clientId,
        scope: ''
      });
    });
  }, []);

  return (
    <div id="input-container" className="overflow-hidden bg-blue-50">
      <Routes>
        <Route path="/:subjectId/input" element={<InputBox/>} />
        <Route path="/profile" element={<Profile/>}/>     
        <Route path="/login" element={<Login/>} />
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/:subjectId/community" element={<CommunityChat/>}/>
        <Route path="/:subjectId/:messageId/thread" element={<Thread/>}/>
        <Route path="/initial" element={<InitialPage/>}/>
      </Routes>
    </div>
  );
};

export default App;