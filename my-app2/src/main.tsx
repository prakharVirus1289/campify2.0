import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {SessionProvider} from './context/userSessions'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { RecoilRoot } from 'recoil';
import { SocketProvider } from './context/socketProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <SessionProvider>
        <SocketProvider>
          <Router>
            <App/>
          </Router>
        </SocketProvider>
      </SessionProvider>
    </RecoilRoot>
  </StrictMode>,
)