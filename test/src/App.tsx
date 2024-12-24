import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(()=>{
    fetch("http://localhost:3000/messageget")
    .then(res=>res.json())
    .then(data=>setUsers(data))
    .catch(err=>console.log(err));
  },[]);

  const handlecClick= async ()=>{

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("message", message);
    console.log(formData);

    const response = await fetch("http://localhost:3000/messagepost", {
      method: 'POST',
      body: formData
    })
    console.log(response);
  }

  return (
    <>
      <div>
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)}/>
        <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)}/>
        <button onClick={handlecClick}>送信</button>
      </div>
      <div>
        {users.map((user, index)=>(
          <div key={index}>
            <p>{user.message}</p>
            <img src={`data:image/jpeg;base64,${user.data}`} alt="image" />
          </div>
        ))}
      </div>
    </>
  )
}

export default App;
