import { useState } from 'react';
import './css/PetPage.css';
import { Link } from 'react-router-dom';

// UserProfile component


//Import user and pet variables.
import { useContext } from 'react';
import AuthContext from "../context/AuthContext"

//Import card icons (update/delete)
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";


function PetPage({  }) {

  // I NEED TO DO THE DELETE PET BUTTON ON MY NEXT CODING SESSION.

  // User and pet variables 
  const {user, setUser} = useContext(AuthContext);
  
  // Update pet State variables
  const [showForm, setShowForm] = useState(false);  // For showing the add/update form
  const [isEditing, setIsEditing] = useState(false);  // To check if we are updating or creating.
  const [selectedPet, setSelectedPet] = useState(null); // To set the selected pet when updating so set input fields
  
  // Delete pet State variables
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [petToDelete, setPetToDelete] = useState(null)

  

  // Containes all addPetForm variables
  const [petForm, setPetForm] = useState({
  name: "",
  species: "Köpek",    // default select value
  breed: "",
  age: "",
  color: "",
  weight: "",
  vaccines: []
  });

  // Cancel button that clears the form and sets it to display:none
  const cancelButton = ()=>{
    setPetForm(
    {name: "",
    species: "Köpek",    // default select value
    breed: "",
    age: "",
    color: "",
    weight: "",
    vaccines: []})
    setIsEditing(false);
    setSelectedPet(null)
  }
  
  
  // Seperate useState for adding vaccine
  const [newVaccine, setNewVaccine] = useState({
  name: "",
  date: ""
  });

  // Form variable setter function
  const handleChange = (e) => {
     const { name, value } = e.target;

    setPetForm((prev) => ({
     ...prev,
     [name]: value
    }));
  
  };

  // OnChange function for Vaccine
  const handleVaccineChange = (e) => {
    const { name, value } = e.target;
    setNewVaccine((prev) => ({ ...prev, [name]: value }));
  };

  // Set the vaccine variable inside the vaccine array in the Petform
  const addVaccine = () => {

    if (!newVaccine.name.trim()) {
      alert("Lütfen aşı adını girin.");
      return;
    }

    if (!newVaccine.date) {
      alert("Lütfen aşı tarihini seçin.");
      return;
    }
    
    setPetForm((prev) => ({
     ...prev,
     vaccines: [...prev.vaccines, newVaccine]
    }));

    setNewVaccine({ name: "", date: "" }); // reset fields
  };

  // Delete vaccine from the vaccine array.
  const removeVaccine = (index) => {
    setPetForm((prev) => ({
    ...prev,
    vaccines: prev.vaccines.filter((_, i) => i !== index),
    }));
  };
  
  // Funtion for posting the new Pet. and message state variable
  const [msg,setMsg] = useState("");

  // Fills the form with the to be updated data and isEditing to true.
  const editPet = (pet)=>{
    setSelectedPet(pet);
    setPetForm(pet)
    setIsEditing(true);
    setShowForm(true);
    
  }
  // Triggers the (Are you sure) modal and sets the pet id to the petToBeDeleted
  const setDeletePet = (id)=>{
    setPetToDelete(id)
    setShowDeleteModal(true)
  }
  // Deletes the selected pet 
  const deletePet = async()=>{

    if(!petToDelete) return alert("Please select a pet to delete")
    
      await fetch(`http://localhost:3000/delete-pet/${petToDelete}`,{
      method: "DELETE",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
    })
    .then(res=> res.json())
    .then(data=> {
      if(data.success){

        setUser((prev)=> ({
          ...prev,
          pets: prev.pets.filter(p=>
             p._id !== petToDelete
          )
        }))
        setShowDeleteModal(false)
        setPetToDelete(null)
        
      }
      else{
        alert(data.msg)
        setShowDeleteModal(false)
        setPetToDelete(null)
      }
    })

  }
  // Pet Add/Update Function
  const submitPet = async(e)=>{
    e.preventDefault()

    if (!petForm.name.trim()) {
    alert("Please enter animal name.");
    return; 
    }

    // Species
    if (!petForm.species.trim()) {
    alert("Please select a species.");
    return;
    }

    // Breed
    if (!petForm.breed.trim()) {
    alert("Please enter breed name.");
    return;
    }

    // Age
    if (!petForm.age || petForm.age <= 0) {
    alert("Age must be greater than zero.");
    return;
    }

    // Weight
    if (!petForm.weight || petForm.weight <= 0) {
    alert("Weight must be greater than zero.");
    return;
    }

    // Color
    if (!petForm.color.trim()) {
    alert("Please enter the pet's color.");
    return;
    }

    // Updating function if isEditing is true
    if(isEditing){

      await fetch(`http://localhost:3000/edit-pet/${selectedPet._id}`,{
        method: "PUT",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(petForm)
      })
      .then(res=> res.json())
      .then(data => {
        
        if(data.success){
          setUser((prev)=>({
            ...prev,
            pets: prev.pets.map((p)=>{
             return p._id === data.pet._id ? data.pet : p
            })
          }))

          setIsEditing(false)
          setShowForm(false)
          setSelectedPet(null)

        }else{
          setMsg(data.msg)
          
        }
      
      
      })
      return
    }


    await fetch("http://localhost:3000/add-pet", {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(petForm)
    })
    .then(res=> res.json())
    .then(data=> {
      if(!data.success){
        setMsg(data.msg)
      }
      else{
        setShowForm(false)
        setUser((prev)=> ({
          ...prev,
          pets: [...prev.pets, data.pet]
        }))
      }


    })
    

  }
  
  
  

  return (
    <>
    <div className="profile-page">
     
      <div className="profile-container">
        
        <div className="profile-header">
          <h2>🐾 My Pets</h2>
          <button
            disabled={!user.isPremium && user.pets.length >= 1}
            onClick={()=> {cancelButton(); setIsEditing(false); setSelectedPet(null);  setShowForm(true)}}
            className="btn-primary"
            data-testid="add-pet-btn"
          >
            + Add Pet
          </button>
        </div>
        
       {/* user premium mu diye if else  */}

         {!user.isPremium && user.pets.length == 1 ?
          <div className="premium-warning">
            <span className="warning-icon">⚠️</span>
            <div>
              <h4>Please switch to premium if you want to add more pets!</h4>
              <p>Premium members can create unlimited pet profiles.</p>
            </div>
            <Link to="/premium" >
            <button
              className="btn-premium"
              data-testid="upgrade-warning-btn"
            >
              ⭐ Become Premium
            </button>
            </Link>
          </div> :""} 
         
        {/* user premium mu diye if else */}

         {/* Add Pet Form */}
        <div className={`card add-pet-form ${!showForm ? "hide" : ""}`}>
          <h3>{isEditing ? "Edit Pet" : "Add New Pet"}</h3>
          <form onSubmit={(e)=> submitPet(e)}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Pet's Name *</label>
                <input
                  required
                  onChange={handleChange}
                  type="text"
                  name="name"
                  className="form-input"
                  value={petForm.name}
                  data-testid="pet-name-input"
                />
                {/* value and onChange were previously managed by petForm state */}
              </div>

              <div className="form-group">
                <label className="form-label">Species *</label>
                <select
                  required
                  onChange={handleChange}
                  name="species"
                  className="form-select"
                  value={petForm.species}
                  data-testid="pet-species-select"
                >
                  <option value="Köpek">Dog</option>
                  <option value="Kedi">Cat</option>
                  <option value="Kuş">Bird</option>
                  <option value="Balık">Fish</option>
                  <option value="Diğer">Other</option>
                  <option value="Tavşan">Bunny</option>
                </select>
                {/* value and onChange were previously managed by petForm state */}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Breed</label>
                <input
                  required
                  onChange={handleChange}
                  type="text"
                  name="breed"
                  className="form-input"
                  value={petForm.breed}
                  data-testid="pet-breed-input"
                />
                {/* value and onChange previously handled by petForm */}
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  required
                  onChange={handleChange}
                  type="number"
                  name="age"
                  className="form-input"
                  value={petForm.age}
                  data-testid="pet-age-input"
                />
                {/* value and onChange previously handled by petForm */}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  required
                  onChange={handleChange}
                  type="text"
                  name="color"
                  className="form-input"
                  value={petForm.color}
                  data-testid="pet-color-input"
                />
                {/* value and onChange previously handled by petForm */}
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input 
                  required
                  onChange={handleChange}
                  type="number"
                  name="weight"
                  className="form-input"
                  value={petForm.weight}
                  data-testid="pet-weight-input"
                />
                {/* value and onChange previously handled by petForm */}
              </div>
            </div>

            <div className="vaccine-section">
              <h4>Vaccination Schedule</h4>
              <div className="form-row">
                <div className="form-group">
                  <input
                    
                    type="text"
                    name='name'
                    className="form-input"
                    placeholder="Vaccine Name"
                    onChange={handleVaccineChange}
                    value={newVaccine.name}
                    data-testid="vaccine-name-input"
                  />
                  {/* value and onChange previously handled by newVaccine state */}
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    name='date'
                    className="form-input"
                    onChange={handleVaccineChange}
                    value={newVaccine.date}
                    onKeyDown={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    data-testid="vaccine-date-input"
                  />
                  {/* value and onChange previously handled by newVaccine state */}
                </div>
                <button
                  onClick={addVaccine} 
                  disabled={!newVaccine.name.trim() || !newVaccine.date}
                  type="button"
                  className="btn-secondary"
                  data-testid="add-vaccine-btn"
                >
                  + Add
                </button>
                {/* onClick previously added vaccine to petForm.vaccines */}
              </div>

              <div className="vaccine-list">
                
                {petForm.vaccines.length > 0 &&
                
                petForm.vaccines.map((vac,key)=>{
                  return <div key={key} className="vaccine-item">
                  <span>💉 {vac.name} - {new Date(vac.date).toISOString().split("T")[0]}</span>
                  <button onClick={()=> removeVaccine(key)} type="button" className="remove-btn">×</button>
                  {/* onClick previously removed this vaccine */}
                </div>
                })

                }
                
              </div>
            </div>

            <div className="form-actions">
              <div className='server-message'>{msg}</div>
              <button
                onClick={()=> {cancelButton(); setShowForm(false); }}
                type="button"
                className="btn-secondary"
                data-testid="cancel-btn"
              >
                Cancel
                {/* onClick previously closed add pet form */}
              </button>
              <button type="submit" className="btn-primary" data-testid="save-pet-btn">
               {!isEditing ? "Save" : "Update"  }
              </button>
              {/* onSubmit previously handled adding pet to userPets */}
            </div>
          </form>
        </div>

        <div className="pets-grid">
          {/* 
            previously conditional rendering: userPets.length === 0 ? empty-state : map over userPets
          */}
          
          {user.pets.length <= 0 && 
          <div className="empty-state">
            <span className="empty-icon">🐾</span>
            <h3>Henüz evcil hayvan eklemediniz</h3>
            <p>Evcil hayvanınızın profilini oluşturmak için yukarıdaki butona tıklayın.</p>
          </div>
          }

          {/* 
            previously mapped over userPets:
            userPets.map(pet => <div className="card pet-card">...</div>)
          */}
          {user.pets.length > 0 &&
            user.pets.map((pet)=>{
             return <div key={pet._id} className="card pet-card">
              
              <div className="card-actions">
                <button className="icon-btn edit" onClick={() => editPet(pet)}>
                <FiEdit size={20} color='#4CAF50'/>
                </button>
                  <button className="icon-btn delete" onClick={() => setDeletePet(pet._id)}>
                    <FiTrash2 size={20} color='#D9534F'/>
                  </button>
              </div>

            <div className="pet-header">
              <div className="pet-avatar">🐶</div>
              <h3>{pet.name ?? "Unknown Pet"}</h3>
              <span className="pet-species">{pet.species ?? "Unknown"}</span>
            </div>

            <div className="pet-details">
              <div className="detail-item">
                <span className="detail-label">Breed:</span>
                <span className="detail-value">{pet.breed ?? "Unknown"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{pet.age ?? 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Color:</span>
                <span className="detail-value">{pet.color ?? "Unknown"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Weight:</span>
                <span className="detail-value">{pet.weight ?? 0} kg</span>
              </div>
            </div>

            <div className="pet-vaccines">
              <h4>Vaccination Schedule</h4>
              {/* previously mapped over pet.vaccines */}
              {pet.vaccines.map((vac)=>{
                return <div key={vac._id} className="vaccine-badge">💉 {vac.name} ({new Date(vac.date).toLocaleDateString("tr-TR")})</div>
              })}
            </div>
              {/* <div className="pet-vaccines">
            <h4>Vet History</h4>
            <div className="vaccine-badge">Ear infection (29.12.2025)</div>
              </div> */}
          </div>

          
            })
          }
        </div>
      </div>
    </div>

    <div className={`confirm-overlay ${!showDeleteModal ? `hide-overlay` : ""}`}>
       <div className={`confirm-box ${!showDeleteModal ? `hide-overlay` : ""}`}>
         <button onClick={()=> {setPetToDelete(null); setShowDeleteModal(false)}} className="confirm-close-btn">
          <IoMdCloseCircle size={22} color="#D9534F" />
        </button>

        <p className="confirm-message">
          Are you sure you want to delete this pet?
       </p>

      <div className="confirm-actions">
        <button onClick={deletePet} className="confirm-yes">Yes, Delete</button>
        <button onClick={()=> {setPetToDelete(null); setShowDeleteModal(false)}} className="confirm-no">Cancel</button>
      </div>
    </div>
  </div>
    
    </>
  );
}

export default PetPage;


