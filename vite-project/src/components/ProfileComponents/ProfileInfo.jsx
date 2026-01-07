import AuthContext from "../../context/AuthContext";
import { useContext, useState } from "react";


const ProfileInfo = ( {setPasswordTab} ) => {

  const areaCodes = [
      {code: "+48" , label: "Poland", flag: "🇵🇱"},
      {code: "+90" , label: "Turkey", flag: "🇹🇷"}
    ];

    const areaCodeRemover = (areaCodes,phoneNumber)=>{
      if(!phoneNumber){return "";}
      const sortedAreaCodes = [...areaCodes].sort((a,b)=> b.code.length-a.code.length);
      
      for(let codes of sortedAreaCodes){
        if(phoneNumber.startsWith(codes.code)){
            return phoneNumber.slice(codes.code.length)
        }
      }
    }

    const {user,setUser} = useContext(AuthContext)
    const [areaCode, setAreaCode] = useState("+48");
    const [formUser,setFormUser] = useState({
        nameSurname: user.nameSurname,
        phone: areaCodeRemover(areaCodes,user.phone) || "",

    })

    const [serverMessage,setServerMessage] = useState("");
    

    const payload = {}; // Only set the variables that are changed inside payload.

    if (formUser.nameSurname.trim() !== user.nameSurname) {
     payload.nameSurname = formUser.nameSurname.trim();
    }

    const cleanLocalPhone = formUser.phone?.trim().replace(/\s+/g, "") || ""; 9012312312
    const normalizedUserPhone = user.phone?.replace(/\s+/g, "") || ""; 

    const fullFormPhone = cleanLocalPhone
    ? `${areaCode}${cleanLocalPhone}`
    : "";

    if(fullFormPhone && fullFormPhone !== normalizedUserPhone) {
      payload.phone = fullFormPhone;
    }

    

    const formSubmit =(e)=>{
        e.preventDefault()
        
        if(!formUser.nameSurname.trim()){
            alert("Name field cannot be empty ")
            return
        }
        
        if(Object.keys(payload).length === 0 ){
            alert("No changes made!")
            return
        }

        fetch("http://localhost:3000/edit-profile",{
            method: "PATCH",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })
        .then(res=> res.json())
        .then(data=>{
            
          if(data.success){
            setUser((prev)=> ({
              ...prev,
              ...(data.updatedUser.phone && { phone: data.updatedUser.phone }),
              ...(data.updatedUser.nameSurname && { nameSurname: data.updatedUser.nameSurname })
            }))

            setServerMessage(data.msg);
          }
          else{
            alert(data.msg)
          }

            
        })
        

    }


  return (
    <>
    <form onSubmit={(e)=> formSubmit(e)} className="profile-info-grid">
  <div className="form-group">
    <label>Full Name</label>
    <input  onChange={e=> setFormUser({...formUser, nameSurname: e.target.value})} name="name" required type="text" value={formUser.nameSurname}/>
  </div>

  <div className="form-group">
    <label>Phone</label>
    <div className="phone-and-area">
    <select onChange={(e)=> setAreaCode(e.target.value)} value={areaCode} name="select-area-code">
      {areaCodes.map((c)=>{
        return <option key={c.code} value={c.code}>{c.flag} {c.code} </option>
      })}
    </select>
    <input maxLength={10} onChange={e=> setFormUser({...formUser, phone: e.target.value})} name="phone" placeholder="" type="tel" value={formUser.phone}/>
     </div>
  </div>

  <div className="form-group">
    <label>Email</label>
    <input name="email" type="email" disabled value={user.email}/>
  </div>

  <div className="password-section">
  <label>Password</label>
  <div className="password-row">
    <span>••••••••••</span>
    <div onClick={()=> setPasswordTab(true)} className="link-btn">Change Password</div>
  </div>
  </div>

  <div className="form-group">
    <button  type="submit" className="save-button">Save</button>
  </div>

  <div className={`server-message`}>{serverMessage}</div>

</form>
  

  
  </>
  
  );
};

export default ProfileInfo;