// js/map.js

// Check if the map container element exists on the page
if (document.getElementById('map')) {
    console.log("Map container found. Initializing map...");

    // 1. Initialize Map
    const map = L.map('map').setView([26.0, 78.0], 5); // Adjusted view to cover more of India

    // 2. Add Tile Layer (Map background)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3. Define Custom Icons
    const businessIcon = L.icon({ iconUrl: 'images/map_pin_business.png', iconSize: [32, 37], iconAnchor: [16, 37], popupAnchor: [0, -37] });
    const workshopIcon = L.icon({ iconUrl: 'images/map_pin_workshop.png', iconSize: [32, 37], iconAnchor: [16, 37], popupAnchor: [0, -37] });
    const marketIcon = L.icon({ iconUrl: 'images/map_pin_market.png', iconSize: [32, 37], iconAnchor: [16, 37], popupAnchor: [0, -37] }); // Make sure this icon exists
    const waterGoodIcon = L.icon({ iconUrl: 'images/map_pin_water_good.png', iconSize: [25, 30], iconAnchor: [12, 30], popupAnchor: [0, -30] });
    const waterPoorIcon = L.icon({ iconUrl: 'images/map_pin_water_poor.png', iconSize: [25, 30], iconAnchor: [12, 30], popupAnchor: [0, -30] });

    // --- Define icon mapping ---
    const iconMapping = {
        'business': businessIcon,
        'workshop': workshopIcon,
        'market': marketIcon, // Added market to mapping
        'water_good': waterGoodIcon,
        'water_poor': waterPoorIcon
    };

    // 4. Fetch Location Data from JSON
    fetch('data/locations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, Failed to fetch locations.json`);
            }
            return response.json();
        })
        .then(locations => {
            console.log("Location data loaded:", locations.length, "entries");

            let addedMarkersCount = 0; // Counter for debugging

            // 5. Add Markers to Map from Fetched Data
            locations.forEach(loc => {
                let iconToUse;
                let popupText = '';

                // Validate coordinates FIRST
                if (typeof loc.lat !== 'number' || typeof loc.lon !== 'number' || isNaN(loc.lat) || isNaN(loc.lon)) {
                    console.warn(`Skipping location with invalid/null coordinates: ${loc.name || 'Unnamed'}`, loc);
                    return; // Skip this location if coordinates are missing/invalid
                }

                // --- Determine Icon and Popup based on Type ---
                if (loc.type === 'water') {
                    const qualityStatus = loc.quality === 'good' ? 'good' : 'poor';
                    iconToUse = (qualityStatus === 'good') ? iconMapping['water_good'] : iconMapping['water_poor'];
                    popupText = `<b>${loc.name || 'Unnamed Location'}</b><br>
                                 State: ${loc.state || 'N/A'}<br>
                                 Quality: <span style="font-weight:bold; color:${qualityStatus === 'good' ? 'green' : 'red'};">${qualityStatus.charAt(0).toUpperCase() + qualityStatus.slice(1)}</span><br>
                                 <small>(${loc.desc || 'Details unavailable'})</small>`;
                } else if (loc.type === 'market') { // **** ADDED THIS BLOCK ****
                    iconToUse = iconMapping['market'];
                    popupText = `<b>${loc.name || 'Unnamed Market'}</b><br>
                                 Type: Farmers' Market<br>
                                 State: ${loc.state || 'N/A'}<br>
                                 <small>(${loc.desc || 'Local produce'})</small>`;
                } else if (iconMapping[loc.type]) {
                    // Handle other types (business, workshop) if defined later
                    iconToUse = iconMapping[loc.type];
                    popupText = `<b>${loc.name || 'Unnamed Location'}</b><br>${loc.desc || 'Details unavailable'}`;
                } else {
                    // Fallback to default icon if type is unknown
                    console.warn(`Unknown location type "${loc.type}" for ${loc.name}. Using default icon.`);
                    iconToUse = L.marker([loc.lat, loc.lon]).options.icon; // Get default icon settings
                    popupText = `<b>${loc.name || 'Unnamed Location'}</b><br>${loc.desc || 'Details unavailable'}`;
                }

                // Create marker with the determined icon and add popup
                L.marker([loc.lat, loc.lon], { icon: iconToUse })
                  .addTo(map)
                  .bindPopup(popupText);

                addedMarkersCount++; // Increment counter

            });

            console.log(`${addedMarkersCount} markers added to map from locations.json.`);
            if (addedMarkersCount < locations.length) {
                console.warn(`Note: ${locations.length - addedMarkersCount} locations were skipped due to missing/invalid coordinates.`);
            }

        })
        .catch(error => {
            console.error("Error loading or processing locations.json:", error);
            L.popup()
              .setLatLng(map.getCenter())
              .setContent(`Could not load location data.<br><small>Error: ${error.message}. Check console (F12) for details.</small>`)
              .openOn(map);
        });

} else {
    console.log("Map container not found on this page.");
}