import { useState } from "react"
import { useContext } from "react"
import AuthContext from "../context/AuthContext"
import "./css/ProfilePage.css"
import { IoMdCloseCircle } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";

// Import Profile info component
import ProfileInfo from "../components/ProfileComponents/ProfileInfo"


const ProfilePage = ()=>{

    // Max size of the profile image
    const MAX_SIZE_MB = 5;

    const {user,setUser} = useContext(AuthContext);
    const [activeTab,setActiveTab] = useState("info")

    // Change password field useStates
    const [serverMessage,setServerMessage] = useState("");
    const [messageType,setMessageType] = useState(false);
    const [passwordTab,setPasswordTab] = useState(false);
    const [userPasswords,setUserPasswords] = useState({
      currentPassword: "",
      newPassword: "",
      repeatPassword: ""
    })

    const passwordSetterFunction = (e)=>{
      const {name, value} = e.target;

      setUserPasswords((prev)=> ({
        ...prev,
        [name]: value
      }))
    }

    const ChangePasswordFunction = async(e)=>{
      e.preventDefault();

      // VALIDATE PASSWORD FIELDS. UNDEFINED/NULL AND "" CHECK.
      const current = userPasswords.currentPassword?.trim();
      const newPass = userPasswords.newPassword?.trim();
      const repeat = userPasswords.repeatPassword?.trim();

      if(current && newPass && newPass === repeat){
        await fetch(`${import.meta.env.VITE_API_URL}/change-password`,{
          method: "PATCH",
          credentials: "include",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({current, newPass}),
        })
        .then(res=> res.json())
        .then(data=>{
          if(data.success){
            setServerMessage(data.msg);
            setMessageType(true);
          }else{
            setServerMessage(data.msg);
            setMessageType(false);
          }
        })
      
      
      }
      

    }

    const handleProfileImageChange = async(e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      await fetch(`${import.meta.env.VITE_API_URL}/upload-profile-picture`,{
        method: "PATCH",
        credentials: "include",
        body: formData
      })
      .then(res=> res.json())
      .then(data=> {
        if(data.success){
          setUser((prev)=> ({
            ...prev,
            profileImage: {url: data.imageUrl}
          }))
        }else{
          alert(data.msg)
        }
        
      })

    }
    
    
    return(<>
    <div className="profile-page">
    <div className="profile-container">
    <div className="profile-layout">

    {/* LEFT PANEL */}
    <aside className="profile-sidebar card">
      <div className="profile-avatar">
        <img src={user.profileImage?.url || Jake } alt="Profile" />

        {/* Overlay */}
          <label className="avatar-overlay">
            <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfileImageChange}
            />
            <span className="edit-icon"><MdOutlineEdit size={30}/></span>
          </label>
      </div>

      <h3>{user.nameSurname}</h3>
      <p className="profile-email">{user.email}</p>

      <div className="profile-stats">
        <div>
          <strong>{user.pets.length}</strong>
          <span>Pets</span>
        </div>
        <div>
          <strong>0</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>0</strong>
          <span>Following</span>
        </div>
      </div>

      <button className="btn-primary">
        Edit Profile
      </button>
    </aside>

    {/* RIGHT PANEL */}
    <section className="profile-main card">
      <div className="profile-tabs">
        <button onClick={()=>setActiveTab("posts")} className={`${activeTab === "posts" ? "active" : ""}`}>Posts</button>
        <button onClick={()=>setActiveTab("info")} className={` ${activeTab === "info" ? "active" : ""}`}>Info</button>
      </div>

      <div className="profile-content">
        {/* Posts grid or Info content */}
        {activeTab === "info" && <ProfileInfo setPasswordTab={setPasswordTab}/>}
        {/* {activeTab === "posts"} */}
        
      </div>
    </section>
  
  </div>
 </div>
</div>
 {/* Password change field */}
  <div className={`confirm-overlay ${!passwordTab ? "hide-overlay" : ""}`}>
  <div className="confirm-box password-box">

    <button
      onClick={() => setPasswordTab(false)}
      className="confirm-close-btn"
    >
      <IoMdCloseCircle size={22} color="#D9534F" />
    </button>

    <p className="confirm-message">Change Password</p>

    <form onSubmit={(e)=> ChangePasswordFunction(e)} className="password-form">

      <div className="form-group">
        <label>Current Password</label>
        <input value={userPasswords.currentPassword} onChange={passwordSetterFunction} name="currentPassword" type="password" />
      </div>

      <div className="form-group">
        <label>New Password</label>
        <input value={userPasswords.newPassword} onChange={passwordSetterFunction} name="newPassword" type="password" />
      </div>

      <div className="form-group">
        <label>Repeat Password</label>
        <input value={userPasswords.repeatPassword} onChange={passwordSetterFunction} name="repeatPassword" type="password" />
      </div>

      <div style={{height: "fit-content"}} className={`server-message ${messageType ? `` : `error`}`}>{serverMessage}</div>

      <div className="confirm-actions">
       <button type="submit" className="confirm-yes password-update-btn">
          Update
        </button>
       <button
       type="button"
        onClick={() => setPasswordTab(false)}
        className="confirm-no"
        >
        Cancel
      </button>
      
      </div>
  </form>

    </div>
    </div>

   
     </>)

}


export default ProfilePage