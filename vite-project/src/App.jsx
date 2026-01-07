import { useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage"
import HomePage from './pages/HomePage';
import PetPage from './pages/PetPage';
import ProfilePage from "./pages/ProfilePage"
import VetFinderPage from './pages/VetFinderPage';
import AIHealthPage from './pages/AIHealthPage';
import PremiumPage from './pages/PremiumPage';
import Navigation from './components/Navigation';
import NotFound from "./pages/NotFound"
import {  Routes, Route, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import { RouteProtect } from "./context/RouteProtect"


function App() {

  const {user,loading} = useContext(AuthContext)
  if(loading){
    return <div>Loading...</div>
  }  

  // navigator.geolocation.getCurrentPosition(function(position){ const userLocation = {lat: position.coords.latitude , lng: position.coords.longitude}})

  const location = useLocation()
  const hideHeader = location.pathname === "/login"
  const hideHeader2 = location.pathname === "/register"
   


  return(
    <>
    {!hideHeader && !hideHeader2 &&  <Navigation/> }
    <Routes>
      <Route path='/' element={ <RouteProtect> <HomePage/> </RouteProtect>}/>
      <Route path='/pets' element={<RouteProtect>  <PetPage/> </RouteProtect>}/>
      <Route path='/profile' element={<RouteProtect>  <ProfilePage/> </RouteProtect>}/>
      <Route path='/vets' element={ <RouteProtect> <VetFinderPage/> </RouteProtect> }/>
      <Route path='/ai-health' element={ <RouteProtect> <AIHealthPage/> </RouteProtect> }/>
      <Route path='/premium' element={<RouteProtect> <PremiumPage/> </RouteProtect>}/>
      <Route path='/login' element={ <LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      {/* If a user goes to unvalid route then show this perfectly styled NotFound page */}
      <Route path='*' element={ <NotFound/>}/> {/* Dont make it protected it goes crazy */}
    </Routes>
    </>
  )
    



}

export default App;


