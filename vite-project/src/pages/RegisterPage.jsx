import { useState } from "react"
import "./css/LoginPage.css"
import { Link } from "react-router-dom"
import petLogo from "../assets/pet-logo.png"


function RegisterPage() {
 
  const [nameSurname, setNameSurname] = useState("")
  const [mail,setMail] = useState("")
  const [password,setPassword] = useState("")
  const [serverMessage , setServerMessage] = useState("")
  const [msgState, setMsgState] = useState("")
  // const [phone,setPhone] = useState("")


  const RegisterFunction = async (e)=>{
      e.preventDefault()
    
      const UserObj = {name: nameSurname, email: mail, password: password,}

      

      await fetch("http://localhost:3000/register",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(UserObj),
        credentials: "include"
      })
      .then(res=> res.json())
      .then(data=> {
       
       data.success ? setMsgState(true) : setMsgState(false)
       setServerMessage(data.msg);
       
       
        
      })

   }

   
    return (
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
            
            <Link to={"/login"} style={{textDecoration: "none", display: "flex", flex: 1}}>
            <button
              className={`tab-button`}
              data-testid="login-tab-btn"
            >
              Log In
            </button>
            </Link>


            <button
              className={`tab-button active`}
              data-testid="register-tab-btn"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={(e) => RegisterFunction(e)} className="login-form">
           
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={nameSurname}
                  onChange={(e)=> setNameSurname(e.target.value)}
                  required
                  data-testid="name-input"
                />
              </div>
        

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={mail}
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

            
              {/* <div className="form-group">
                <label className="form-label">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={phone}
                  onChange={(e)=> setPhone(e.target.value)}
                  data-testid="phone-input"
                />
              </div> */}
           

            <button type="submit" className="btn-primary btn-full" data-testid="submit-btn">
              Sign Up
            </button>

              <div className={`server-message ${!msgState ? `message-error` : "" }`}>{serverMessage}</div>

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
  )
}

export default RegisterPage