
    // Initialize the map
    var map = L.map('map').setView([48.8566, 2.3522], 13); // Default: Paris

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // OpenRouteService API Key
    const apiKey = routeKey; 
    console.log(coordinates);
    // Function to get coordinates of a location
    async function getCoordinates(query) {
        // const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${query}`;
        // const response = await fetch(url);
        // const data = await response.json();
        // console.log(data);
        // console.log(data.features);
        if (coordinates.length > 0) {
            return coordinates.reverse(); // Convert [lon, lat] to [lat, lon]
        } else {
            console.error("Location not found");
            return null;
        }
    }

    // Function to place a marker on the map
    async function placeMarker(location) {
        const coords = await getCoordinates(location);
        if (coords) {
            L.marker(coords).addTo(map)
                .bindPopup(`Location: ${location}`)
                .openPopup();
            map.setView(coords, 13);
        }
    }

    // Example: Pinpoint "Berlin, Germany"
    placeMarker(loc);