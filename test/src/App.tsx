import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import { Buffer } from 'buffer';
import './App.css'

function App() {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<{message:string, data:Blob}[]>([]);

  useEffect(()=>{
    // const reader = new FileReader();
    // reader.readAsDataURL(users[0].data);
    // // reader.onload = (e)=>{
    //   console.log(e.target?.result);
    // }
    console.log(users);
  },[users]);

  useEffect(()=>{
    fetch("http://localhost:3000/messageget")
    .then(res=>res.json())
    .then(data=>{
      console.log("data type",typeof data);
      console.log("data",data);
      data.map((user:any)=>{
        // const filereader = new FileReader();
        console.log("user.data.data type",typeof user.data.data);
        console.log("user.data.data",user.data.data);
        const uint8Array = new Uint8Array(user.data.data);
        console.log("uint8Array type",typeof uint8Array);
        console.log("uint8Array",uint8Array);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        setUsers((prevUsers)=>[...prevUsers, {message:user.message, data:blob}]);
      })
    })
    .catch(err=>console.log(err));
  },[]);

  const handlecClick= async ()=>{

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("message", message);
    console.log("formData",formData);

    const response = await fetch("http://localhost:3000/messagepost", {
      method: 'POST',
      body: formData
    })
    console.log("response",response);
    console.log("file",file);
  }

  return (
    <>
      <div>
        <input type="file" id="fileInput" onChange={(e)=>setFile(e.target.files?.[0] ?? null)}/>
        <img id="preview" src={file ? URL.createObjectURL(file) : ""} alt="image" />
        <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)}/>
        <button onClick={handlecClick}>送信</button>
      </div>
      <div>
        {users.map((user, index)=>(
          <div key={index}>
            <p>{user.message}</p>
            <img src={URL.createObjectURL(user.data)} alt="image" />
          </div>
        ))}
      </div>
    </>
  )
}

export default App;
