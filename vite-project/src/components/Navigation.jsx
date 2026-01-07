import './Navigation.css';
import { Link } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from "../context/AuthContext"
import { useNavigate } from 'react-router-dom';
import petLogo from "../assets/pet-logo.png"
import { CgProfile } from "react-icons/cg";


function Navigation({}) {

    const {setUser} = useContext(AuthContext)
    const navigate = useNavigate()

    const LogoutFunc = async(e)=>{
      e.preventDefault()

      await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include"
      })  
      .then(res => res.json())
      .then(()=> {
    
        setUser(null)
        navigate("/login")
        
      
      })

    }


  return (
    <nav className="navbar">
      <Link to={"/"} className="logo-container">
        <div className="logo">
          <img src={petLogo} alt="petPlus-logo" />
        </div>
        <h1 className="logo-text">PetPlus</h1>
      </Link>

      <ul className="nav-links">
        <li>
          <Link className="nav-link" to="/" data-testid="nav-home-btn">
            🏠 Home
          </Link>
        </li>
        <li>
          <Link style={{display: "flex" , alignItems: "center", justifyContent: "center", gap: "2px"}} className="nav-link" to="/profile" data-testid="nav-home-btn">
            👤 Profile
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/pets" data-testid="nav-profile-btn">
            🐾 My Pets
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/vets" data-testid="nav-vet-btn">
            🏥 Vets
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/ai-health" data-testid="nav-ai-btn">
            🤖 AI Health
          </Link>
        </li>
        {/* Premium kismi icin if else lazim */}
          <li>
            <Link className="nav-link premium-nav" to="/premium" data-testid="nav-premium-btn">
              ⭐ Premium
            </Link>
          </li>
        
        <li>
          
          <button onClick={(e)=> LogoutFunc(e)} className="btn-logout" data-testid="logout-btn">
            Log out
          </button>
          
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;