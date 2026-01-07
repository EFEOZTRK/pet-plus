import { useState, useEffect , useRef } from 'react';
import './css/VetFinderPage.css';



function VetFinderPage() {
  
  // const [searchQuery, setSearchQuery] = useState('');
  const [selectedVet, setSelectedVet] = useState(null); 
  const [vets, setVets] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  
  const [userLocation, setUserLocation] = useState(null);

  // Distance calculator algo.
  function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

 // UseEffect that sets the userLocation with lng and  
  useEffect(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    setUserLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  });
  }, []);
// Simple useRef data to check if user moved more than 500meters or if 2 minutes past since last fetch
  const lastFetchRef = useRef({
  time: 0,
  lat: null,
  lng: null,
  });
// UseEffect that fetches the vet data using the user location

  useEffect(() => {
  if (!userLocation) return;
    // setIsLoading(true);
  const now = Date.now();
  const last = lastFetchRef.current;

  const timePassed = now - last.time > 2 * 60 * 1000; // 2 minutes

  const movedEnough =
    last.lat === null ||
    getDistanceKm(
      last.lat,
      last.lng,
      userLocation.lat,
      userLocation.lng
    ) > 0.5; // 500 meters

  if (!timePassed && !movedEnough) return;

  lastFetchRef.current = {
    time: now,
    lat: userLocation.lat,
    lng: userLocation.lng,
  };

  fetch("http://localhost:3000/vets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userLocation),
  })
    .then((res) => res.json())
    .then((data) => {
      const vetsWithDistance = data.map((vet) => ({
        ...vet,
        distance: getDistanceKm(
          userLocation.lat,
          userLocation.lng,
          vet.geometry.location.lat,
          vet.geometry.location.lng
        ),
      }))
      .sort((a,b)=> a.distance - b.distance)
      
      setVets(vetsWithDistance);
      // setIsLoading(false);
      // Get the vets.length so I can show on the main page.
      localStorage.setItem("nearbyVetsCount",vetsWithDistance.length.toString())
    });
    }, [userLocation]);

    

  return (
    <div className="vet-finder-page">
     

      <div className="vet-finder-container">
        <div className="page-header">
          <h2>🏥 Veterinarians Near Me</h2>
          <p className="page-desc">
            Find the closest vets to your location
          </p>
        </div>
       
        {/* <div className="search-section card">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Veteriner veya bölge arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="vet-search-input"
          />
          <button className="btn-primary" data-testid="search-btn">
            🔍 Ara
          </button>
        </div> */}

        <div className="vet-content">

          
          <div className="vet-list-section">
            {vets.map((vet) => (
              <div
                key={vet.place_id}
                className={`card vet-card ${selectedVet?.id === vet.id ? 'selected' : ''}`}
                onClick={() => setSelectedVet(vet)}
                data-testid={`vet-card-${vet.place_id}`}
              >
                <div className="vet-card-header">
                  <div>
                    <h3>{vet.name}</h3>
                    <p className="vet-address">📍 {vet.vicinity}</p>
                  </div>
                  <div className="vet-distance">{Math.floor(vet.distance *10)/10}km</div>
                </div>

                <div className="vet-rating">
                  <span className="rating-stars">⭐ {vet.rating}</span>
                  <span className="rating-reviews">({vet.user_ratings_total} ratings)</span>
                </div>

                

                <div className="vet-contact">
                  <span>🕘 
                    {
                     vet.opening_hours?.open_now === true
                     ? "Open"
                     : vet.opening_hours?.open_now === false
                     ? "Closed"
                     : "Unknown"
                    }
                  </span>
                  <span>📞 {vet.international_phone_number}</span>
                </div>

                <div className="vet-actions">
                  <button className="btn-secondary" data-testid={`call-btn-${vet.id}`}>
                    📞 Call
                  </button>
                  <button className="btn-primary" data-testid={`directions-btn-${vet.id}`}>
                    📍 Directions
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="map-section">
  <div className="card map-card">

    {/* MAP AREA */}
    {selectedVet ? (
      <iframe
        title="Vet location"
        className="map-iframe"
        loading="lazy"
        src={`https://www.google.com/maps?q=${selectedVet.geometry.location.lat},${selectedVet.geometry.location.lng}&z=15&output=embed`}
      />
    ) : (
      <div className="map-placeholder">
        <div className="map-icon">🗺️</div>
        <h3>Map View</h3>
        <p>Choose a veterinarian</p>
      </div>
    )}

    {/* INFO AREA */}
    {selectedVet && (
      <div className="selected-vet-info">
        <h4>Selected Veterinarian</h4>

        <p><strong>{selectedVet.name}</strong></p>
        <p>{selectedVet.vicinity || selectedVet.address}</p>

        <p>
          🕘{" "}
          {selectedVet.opening_hours?.open_now === true
            ? "Open"
            : selectedVet.opening_hours?.open_now === false
            ? "Closed"
            : "Unknown"}
        </p>

        <button
          className="btn-primary btn-full"
          onClick={() => {
            const { lat, lng } = selectedVet.geometry.location;
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
              "_blank"
            );
          }}
        >
         Open in Google Maps
        </button>
      </div>
    )}
  </div>







            {/* <div className="card emergency-info">
              <h4>🚨 Acil Durum Veterinerleri</h4>
              <p>24 saat hizmet veren klinikler:</p>
              <div className="emergency-list">
                {vets
                  .filter((v) => v.hours === '24 Saat')
                  .map((vet) => (
                    <div key={vet.id} className="emergency-item">
                      <strong>{vet.name}</strong>
                      <span>{vet.phone}</span>
                    </div>
                  ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VetFinderPage;


