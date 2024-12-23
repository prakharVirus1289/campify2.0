// import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton = () => {
  const navigate = useNavigate();
  
  const responseGoogle = (response: any) => {
    if (response.error) {
      console.error('Google login failed:', response.error);
      return;
    }

    // Store the token in localStorage or sessionStorage to manage the session
    const { tokenId } = response;

    // Optionally: Send token to backend to validate and create a session
    fetch('http://localhost:5000/', {
      method: 'POST',
      body: JSON.stringify({ tokenId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Store user info (you could also store in sessionStorage for session lifetime)
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        // Redirect to the dashboard or home page
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error during authentication:', error);
      });
  };

  return (
    <div>
      <GoogleLogin
        clientId="571515744262-babulumvica83kk8alpr0mbqmjqvk0uu.apps.googleusercontent.com" // Use your Google OAuth Client ID
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
      />
      <script src="https://accounts.google.com/gsi/client" onLoad={console.log('TODO: add onload function')}>
      </script>
    </div>
  );
};

export default GoogleSignInButton;
