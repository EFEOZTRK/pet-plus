import { use, useState } from 'react';
import './css/LoginPage.css';
import { Link  } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import petLogo from "../assets/pet-logo.png"
import { IoMdCloseCircle } from "react-icons/io";



function LoginPage({}) {
  // When user is verified get the result from url params.
  const location = useLocation()
  const navigate = useNavigate()
  const getVerified = new URLSearchParams(location.search)
  let verified = getVerified.get("verified")

  // UseStates for form
  const [email,setMail] = useState("")
  const [password,setPassword] = useState("")
  const [serverMessage , setServerMessage] = useState("")
  const {setUser} = useContext(AuthContext)

  // UseStates for forgot my password.
  const [showForgotPassword,setShowForgotPassword] = useState(false);
  const [forgotEmail,setForgotEmail] = useState("")
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState(false);
  const [forgotPasswordMessage,setForgotPasswordMessage] = useState("");
  
  // User login OnSubmit function
  const formSubmitLogin = async (e)=>{
    e.preventDefault()
    const userObj = {email:email,password:password};

    await fetch("http://localhost:3000/login",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: 'include',
      body: JSON.stringify(userObj)
    })

    .then(res => res.json())
    .then(data => {

      if (data.success) {
        setUser(data.user)
      navigate('/');
      return; // stop further execution
      } 
      setServerMessage(data.msg);
     

    })
  }

  // User forgot password OnSubmit function
  const forgotPasswordSubmit = async(e)=>{
    e.preventDefault()
    const userMail = forgotEmail?.trim(); //trim empty space
    if(!userMail){ setForgotPasswordStatus(false); setForgotPasswordMessage("Email field can not be empty!"); return; }

    await fetch("http://localhost:3000/forgot-password",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: userMail})
    })
    .then(res=> res.json())
    .then(data=> {
      if(data.success){
        setForgotPasswordStatus(true)
        setForgotPasswordMessage(data.msg)
      }
      else{
        setForgotPasswordStatus(false)
        setForgotPasswordMessage(data.msg)
      }

    })
  
  
  }

  return (
    <>
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <div className="logo">
            <img src={petLogo} alt="petPlus-logo" />
          </div>
          <h1 className="logo-text">PetPlus</h1>
          <p className="tagline">Pet Social Network</p>
        </div>

        <div className="login-card">
          <div className="tab-buttons">
            <button
              className={`tab-button active`}
              data-testid="login-tab-btn"
            >
              Log In
            </button>

              <Link to={"/register"} style={{display: "flex" , textDecoration: "none",flex: 1 }} >
             <button
              className={`tab-button`}
              data-testid="register-tab-btn"
            >
              Sign Up
            </button>
            </Link>
            
          </div>

          <form onSubmit={(e)=> formSubmitLogin(e)} className="login-form">
            

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={email}
                onChange={(e)=> setMail(e.target.value)}
                required
                data-testid="email-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                required
                data-testid="password-input"
              />
            </div>

           

            <button className="btn-primary btn-full" data-testid="submit-btn">
              Log In
            </button>
            <p onClick={()=> setShowForgotPassword(true)} className='forgot-password'>Forgot your password ?</p>
            {/* Message returned from server when user triest to login */}
            <div style={{color: "red"}} className={`server-message  `}>{serverMessage}</div>

            {/* Messages when user clicks on the account verification link */}
            {verified == "true" ? <div style={{color: "green"}} className="server-message">You have been verified </div> : "" }
            {verified == "failed" ? <div style={{color: "red"}} className="server-message ">Verification failed. Try again</div>: ""}

          </form>

          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">🐾</span>
              <span>Pet Profiles</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏥</span>
              <span>Finding a Veterinarian</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <span>AI Health Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* CHANGE PASSWORD BOX */}
    <div onClick={()=> setShowForgotPassword(false)} className={`change-password-modal ${showForgotPassword ? "" : "close-modal" }`}>
    <div onClick={(e)=> e.stopPropagation()} className='change-password-box'>
      <IoMdCloseCircle onClick={()=> setShowForgotPassword(false)} size={22} color="#D9534F" />
    <form onSubmit={(e)=> forgotPasswordSubmit(e)} className="password-form">
      <p className='box-name'>Reset password</p>
      
      <div className="form-group">
        <label>Email</label>
        <input onChange={(e)=> setForgotEmail(e.target.value)} value={forgotEmail} name="change-password-email" type="mail" />
      </div>

      <button type='submit'>Send link</button>
      
      <p className={`reset-password-message ${forgotPasswordStatus ? "" : 'message-false'}`}>{forgotPasswordMessage}</p>
    </form>
    </div>
    </div>
    </>
  );
}

export default LoginPage;


