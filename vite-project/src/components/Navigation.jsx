import './Navigation.css';
import { Link } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from "../context/AuthContext"
import { useNavigate } from 'react-router-dom';
import petLogo from "../assets/pet-logo.png";

// Importing icons from react-icons
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { FaRobot } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";



function Navigation({}) {

    const {setUser} = useContext(AuthContext)
    const navigate = useNavigate()

    const LogoutFunc = async(e)=>{
      e.preventDefault()

      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
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
        <Link className="nav-link" to="/">
          <span className="nav-icon"><FaHome/></span>
          <span className="nav-label">Home</span>
        </Link>
      </li>

      <li>
        <Link className="nav-link" to="/profile">
          <span className="nav-icon"><CgProfile/></span>
          <span className="nav-label">Profile</span>
        </Link>
      </li>

      <li>
        <Link className="nav-link" to="/pets">
          <span className="nav-icon"><MdPets/></span>
          <span className="nav-label">My Pets</span>
        </Link>
      </li>

      <li>
        <Link className="nav-link" to="/vets">
          <span className="nav-icon"><GiHealthNormal/></span>
          <span className="nav-label">Vets</span>
        </Link>
      </li>

      <li>
        <Link className="nav-link" to="/ai-health">
          <span className="nav-icon"><FaRobot/></span>
          <span className="nav-label">AI Health</span>
        </Link>
      </li>

      <li>
        <Link className="nav-link premium-nav" to="/premium">
          <span className="nav-icon"><FaStar color='#ccb849'/></span>
          <span className="nav-label">Premium</span>
        </Link>
      </li>
        </ul>
      <button onClick={(e)=> LogoutFunc(e)} className="btn-logout" data-testid="logout-btn">
            Log out
          </button>
    </nav>
  );
}

export default Navigation;