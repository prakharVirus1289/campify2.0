import './index.css';
import InputBox from './inputBox/pages/inputBox';
import Login from './pages/login';
import Logout from './components/logout';
import { Route, Routes } from 'react-router-dom';
// import Subject from './components2/subject';
import CommunityChat from './pages/communityChat';
// import ChatBlock from './components2/chatblock';
import {gapi} from 'gapi-script';
import { useEffect } from 'react';
import Thread from './thread/thread';
import InitialPage from './pages/initialPage';
// import Test from './test/test';
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
        <Route path="/:sessionId/:subjectId/input" element={<InputBox/>} />
        <Route path="/:sessionId/profile" element={<Profile/>}/>     
        <Route path="/login" element={<Login/>} />
        <Route path="/:sessionId/logout" element={<Logout/>}/>
        <Route path="/:sessionId/:subjectId" element={<CommunityChat/>}/>
        <Route path="/:sessionId/:subjectId/:messageId/thread" element={<Thread/>}/>
        <Route path="/:sessionId/initial" element={<InitialPage/>}/>
        <Route path="/:sessionId/profile" element={<Profile/>}/>
      </Routes>
    </div>
  );
};

export default App;