import { useEffect, useState } from 'react';
import './css/HomePage.css';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Jake from "../assets/jake.jpg"

// NEXT TIME WILL BE IMPLEMENTING PET PROFILE PICTURE UPDATES.
// FORGOT PASSWORD FOR THE LOGIN PAGE
// THEN AI PAGE 


function HomePage({}) {
const {user} = useContext(AuthContext)
const [nearbyVetsCount, setNearbyVetCount] = useState(0);
 
useEffect(()=>{
  const count = localStorage.getItem("nearbyVetsCount");
  if(count) setNearbyVetCount(Number(count));
},[])

  return (
    <div className="home-page">
      

      <div className="home-container">
        <aside className="sidebar-left">
          <div className="card profile-summary">
            <div className="profile-avatar">
              <img src={user.profileImage?.url || Jake } alt="Profile" />
            </div>
            <h3>{user.nameSurname ?? "Guest" }</h3>
            <p className="profile-email">{user.email ?? "example@gmail.com"}</p>
            
            {/* Burdaki yine premiumlar icin if else */}
              {user.isPremium && 
              <div className="premium-badge">
                <span>⭐</span> Premium
              </div>}
            {/*  Burdaki yine premiumlar icin if else */}
            
            <Link to={"/profile"}>
            <button
              className="btn-secondary btn-full"
              data-testid="view-profile-btn"
            >
              Show Profile
            </button>
            </Link>
          </div>

          <div className="card quick-stats">
            <h4>Quick Access</h4>
            <div className="stat-item">
              <span className="stat-icon">🐾</span>
              <Link style={{textDecoration: "none"}} to={"/pets"}>
              <div>
                <div className="stat-number">{user.pets.length ?? 0}</div> {/* Burasi ve yakin veteriner kismi conditional render. */}
                <div className="stat-label">My Pets</div>
              </div>
              </Link>

            </div>
            <div className="stat-item" >
              <span className="stat-icon">🏥</span>
              <Link style={{textDecoration: "none"}} to={"/vets"}>
              <div>
                <div className="stat-number">{nearbyVetsCount}</div>
                <div className="stat-label">Veterinarians near me</div>
              </div>
              </Link>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🤖</span>
              <Link style={{textDecoration: "none"}} to={"/ai-health"}>
              <div>
                <div className="stat-number">AI</div>
                <div className="stat-label">Health analysis</div>
              </div>
              </Link>
            </div>
          </div>
        </aside>

        <main className="main-feed">
          <div className="card create-post">
            <h3>Create a post</h3>
            {/* Burdaki forma on submut func gelicek */}
            <form >
              {/* Eger kullaniciinin hayvani varsa yani pet.length ise bu */}
                <select
                  className="form-select"
                  // value=""
                  data-testid="select-pet-dropdown"
                >
                  <option value="">Select Pet</option>

                  {/* Buraya map islemi olucak pet ismi zart zzurt */}

                    <option key="1" value="Hayvan ismi">
                      Pamuk
                    </option>

                  {/* Buraya map islemi olucak pet ismi zart zzurt */}
                </select>
              {/* Eger kullaniciinin hayvani varsa yani pet.length ise bu */}
              <textarea
                className="form-textarea"
                placeholder="What's on your mind today?"
                // value=""
                data-testid="new-post-textarea"
              />
              <div className="post-actions">
                <button type="button" className="action-btn" data-testid="upload-photo-btn">
                  📷 Image
                </button>
                <button type="submit" className="btn-primary" data-testid="publish-post-btn">
                  Share
                </button>
              </div>
            </form>
          </div>

          <div className="posts-list">
            {/* Postlari mapledigimiz mekan */}
              <div key="post idsi" className="card post-card">
                <div className="post-header">
                  <div className="post-user">
                    <span className="user-avatar">😊</span>
                    <div>
                      <div className="user-name">Efe</div>
                      <div className="post-time">26/12/2025</div>
                    </div>
                  </div>
                  <div className="pet-tag">🐾 Clutch</div>
                </div>

                <div className="post-content">
                  <p>My dog resting after a whole day of walking</p>
                  {/* Postun icinde img varsa if else */}
                    {/* <img src="resim url" alt="Post" className="post-image" /> */}
                  <img style={{width: "300px" , height: "400px"}} src="https://img.freepik.com/free-photo/high-angle-dog-playing-with-toilet-paper-home_23-2149544902.jpg?semt=ais_hybrid&w=740&q=80" alt="" />

                  {/* Postun icinde img varsa if else */}
                </div>

                <div className="post-footer">
                  <button
                    className="post-action"
                  >
                    ❤️  25
                  </button>
                  <button className="post-action" >
                    💬  21
                  </button>
                  <button className="post-action">
                    📤 Share
                  </button>
                </div>
              </div>
            {/* Postlari mapledigimiz mekan */}
          </div>
        </main>

        <aside className="sidebar-right">
          {/* Burda eger user premium degilse bu karti goster. */}
          {!user.isPremium &&
          <div className="card">
            <h4>Switch to premium</h4>
            <p className="premium-desc">
              Upgrade to a premium membership for unlimited pet profiles and advanced AI analytics!
            </p>
            <Link style={{textDecoration: "none"}} to={"/premium"}>
            <button
              className="btn-premium btn-full"
              data-testid="upgrade-premium-btn"
            >
              ⭐ Become a Premium User
            </button>
            </Link>
          </div>}
            {/* Burda eger user premium degilse bu karti goster. */}
          
          <div className="card">
            {/* Burdaki veterinerler google apiden gelicek */}
            <h4>Recommended Veterinarians</h4>
            <div className="vet-list">
              <div className="vet-item">
                <span className="vet-icon">🏥</span>
                <div>
                  <div className="vet-name">Dr. Ahmet Veteriner</div>
                  <div className="vet-distance">2.5 km</div>
                </div>
              </div>
              <div className="vet-item">
                <span className="vet-icon">🏥</span>
                <div>
                  <div className="vet-name">Pet Health Veterinary Clinic</div>
                  <div className="vet-distance">3.8 km</div>
                </div>
              </div>
            </div>
            <Link style={{textDecoration: "none"}} to={"/vets"}>
            <button
              className="btn-secondary btn-full"
              data-testid="find-vets-btn"
            >
              See All
            </button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default HomePage;


