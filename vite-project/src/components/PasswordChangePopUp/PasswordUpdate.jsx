import { redirect, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PasswordUpdate.css"


function PasswordUpdate() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [messageState, setMessageState] = useState(null)
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(!password.trim() || !repeatPassword.trim()){
    setServerMessage("Please enter both fields!"); 
    setMessageState(false);
    return
    }

    if(password.trim() !== repeatPassword.trim()){
    setServerMessage("Passwords should match!"); 
    setMessageState(false);
    return
    }

    await fetch(`http://localhost:3000/update-password?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    .then(res=> res.json())
    .then(data=> {
        if(!data.success){
            setServerMessage(data.msg)
            setMessageState(false)
            setLoading(false)
        }
        if(data.success){
            navigate("/login?reset=success")
        }
    })

  };

  return (
    <div className={`confirm-overlay`}>
        <div className="confirm-box password-box">

    <h2 className="confirm-message">Change Password</h2>

    <form onSubmit={(e)=> handleSubmit(e)} className="password-form">

      <div className="form-group">
        <label>New Password</label>
        <input value={password} onChange={(e)=> setPassword(e.target.value)} name="newPassword" type="password" />
      </div>

      <div className="form-group">
        <label>Repeat Password</label>
        <input value={repeatPassword} onChange={(e)=> setRepeatPassword(e.target.value)} name="repeatPassword" type="password" />
      </div>

      <div style={{height: "fit-content"}} className={`server-message ${messageState ? `success` : `error`}`}>{serverMessage}</div>

      <div className="confirm-actions">
       <button disabled={loading} type="submit" className="confirm-yes password-update-btn">
          Update
        </button>
      </div>

    </form>
  </div>
</div>

  );
}

export default PasswordUpdate;