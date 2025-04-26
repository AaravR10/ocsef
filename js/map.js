// Ensure the map container exists
if (document.getElementById('map')) {

    // --- Initialize Map ---
    // Set initial coordinates (e.g., a central location) and zoom level
    const map = L.map('map').setView([51.505, -0.09], 10); // Example: London

    // --- Add Tile Layer ---
    // Using OpenStreetMap tiles (requires attribution)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // --- Define Custom Icons (Requires you create these images) ---
    const businessIcon = L.icon({
        iconUrl: 'images/map_pin_business.png',
        iconSize: [32, 37], // size of the icon
        iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -37] // point from which the popup should open relative to the iconAnchor
    });

    const workshopIcon = L.icon({
        iconUrl: 'images/map_pin_workshop.png',
        iconSize: [32, 37], iconAnchor: [16, 37], popupAnchor: [0, -37]
    });

     const marketIcon = L.icon({
        iconUrl: 'images/map_pin_market.png',
        iconSize: [32, 37], iconAnchor: [16, 37], popupAnchor: [0, -37]
    });

     const waterGoodIcon = L.icon({
        iconUrl: 'images/map_pin_water_good.png',
        iconSize: [25, 30], iconAnchor: [12, 30], popupAnchor: [0, -30]
    });

      const waterPoorIcon = L.icon({
        iconUrl: 'images/map_pin_water_poor.png',
        iconSize: [25, 30], iconAnchor: [12, 30], popupAnchor: [0, -30]
    });


    // --- Sample Marker Data (Replace with dynamic data from backend/JSON file later) ---
    const locations = [
        { lat: 51.51, lon: -0.1, type: 'business', name: 'Sustainable Goods Store', desc: 'Organic foods and eco-friendly products.' },
        { lat: 51.495, lon: -0.08, type: 'workshop', name: 'Repair Cafe Central', desc: 'Monthly electronics & textile repair sessions.' },
        { lat: 51.52, lon: -0.12, type: 'market', name: 'City Farmers\' Market', desc: 'Local produce every Saturday.' },
        { lat: 51.505, lon: -0.05, type: 'water', quality: 'good', name: 'River Point A', desc: 'Water quality tested: Good (Oct 2023)' },
         { lat: 51.48, lon: -0.11, type: 'water', quality: 'poor', name: 'Canal Section B', desc: 'Water quality tested: Poor - High Nitrates (Oct 2023)' },
        // Add more locations
    ];

    // --- Add Markers to Map ---
    locations.forEach(loc => {
        let icon;
        let popupContent = `<b>${loc.name}</b><br>${loc.desc}`;

        switch(loc.type) {
            case 'business': icon = businessIcon; break;
            case 'workshop': icon = workshopIcon; break;
            case 'market': icon = marketIcon; break;
            case 'water':
                icon = (loc.quality === 'good') ? waterGoodIcon : waterPoorIcon;
                popupContent = `<b>Water Quality Report</b><br>Location: ${loc.name}<br>Status: ${loc.quality.charAt(0).toUpperCase() + loc.quality.slice(1)}<br><small>${loc.desc}</small>`;
                break;
            default: icon = L.marker([loc.lat, loc.lon]).options.icon; // Default icon
        }

        L.marker([loc.lat, loc.lon], { icon: icon })
          .addTo(map)
          .bindPopup(popupContent);
    });

    // --- Optional: Add user location ---
    // map.locate({setView: true, maxZoom: 14});
    // function onLocationFound(e) {
    //     L.marker(e.latlng).addTo(map).bindPopup("You are approximately here").openPopup();
    // }
    // map.on('locationfound', onLocationFound);
    // function onLocationError(e) {
    //     alert("Could not find your location: " + e.message);
    // }
    // map.on('locationerror', onLocationError);


    console.log("Map initialized.");

} else {
    console.log("Map container not found on this page.");
}