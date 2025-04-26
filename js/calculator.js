function calculateFootprint() {
    // --- Get Input Values ---
    const distance = parseFloat(document.getElementById('commute-distance').value) || 0;
    const mode = document.getElementById('commute-mode').value;
    const flightsShort = parseFloat(document.getElementById('flights-short').value) || 0;
    const flightsLong = parseFloat(document.getElementById('flights-long').value) || 0;

    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const heating = document.getElementById('heating-fuel').value;
    const renewables = document.getElementById('renewable-source').value;

    const diet = document.getElementById('diet').value;
    const waste = document.getElementById('waste').value;

    // --- Simplified Emission Factors (kg CO2e) - THESE ARE VERY ROUGH ESTIMATES ---
    // Source: Needs proper research (e.g., EPA, DEFRA, IPCC) for real app
    const factors = {
        // Transport (per km)
        car_gasoline: 0.17, // Varies hugely by car
        car_electric: 0.05, // Depends on electricity grid mix
        public_transport: 0.04, // Average bus/train
        bike: 0,
        walk: 0,
        // Flights (per flight - extremely simplified)
        flight_short: 150, // e.g., < 3 hours
        flight_long: 700, // e.g., > 3 hours
        // Energy (per unit)
        electricity_kwh: 0.3, // Highly dependent on grid mix
        heating_gas: 0.2, // per kWh equivalent (need conversion from usage) - simplified here
        heating_oil: 0.28, // per kWh equivalent - simplified here
        heating_wood: 0.02, // Assuming sustainable sourcing (can be complex)
        // Consumption (annual estimate based on category)
        diet_meat_heavy: 3300,
        diet_meat_average: 2500,
        diet_vegetarian: 1700,
        diet_vegan: 1500,
        waste_high: 600,
        waste_average: 400,
        waste_low: 200,
    };

    // --- Calculate ---
    let transportEmissions = 0;
    if (mode !== 'bike' && mode !== 'walk') {
        transportEmissions += distance * 365 * factors[mode]; // Daily commute for a year
    }
    transportEmissions += flightsShort * factors.flight_short;
    transportEmissions += flightsLong * factors.flight_long;

    let energyEmissions = 0;
    let electricityFactor = factors.electricity_kwh;
    if (renewables === 'yes_full') electricityFactor = 0;
    if (renewables === 'yes_partial') electricityFactor *= 0.5; // Simple reduction

    energyEmissions += electricity * 12 * electricityFactor; // Monthly kWh for a year

    // Simplified heating - assume average annual use (e.g., 12000 kWh gas = 2400 kg CO2e) - VERY ROUGH
    let heatingFactor = 0;
    if (heating === 'natural_gas') heatingFactor = 2400;
    else if (heating === 'oil') heatingFactor = 3300;
    else if (heating === 'electricity') heatingFactor = (12000 * electricityFactor); // If heating via electric
    else if (heating === 'wood') heatingFactor = 240; // Assuming 12000 kWh equivalent use
    energyEmissions += heatingFactor * (renewables === 'yes_full' ? 0 : (renewables === 'yes_partial' ? 0.5 : 1)); // Apply renewable reduction


    let consumptionEmissions = 0;
    consumptionEmissions += factors['diet_' + diet] || 0;
    consumptionEmissions += factors['waste_' + waste] || 0;


    let totalEmissions = transportEmissions + energyEmissions + consumptionEmissions;

    // --- Display Results ---
    const resultsDiv = document.getElementById('calculator-results');
    const footprintValueSpan = document.getElementById('footprint-value');
    const breakdownDiv = document.getElementById('result-breakdown');
    const tipsUl = document.getElementById('personalized-tips');

    if (!resultsDiv || !footprintValueSpan || !breakdownDiv || !tipsUl) {
        console.error("Calculator result elements not found!");
        return;
    }


    footprintValueSpan.textContent = totalEmissions.toFixed(0); // Show whole number

    breakdownDiv.innerHTML = `
        <p>Transport: ${transportEmissions.toFixed(0)} kg CO2e</p>
        <p>Home Energy: ${energyEmissions.toFixed(0)} kg CO2e</p>
        <p>Consumption (Diet & Waste): ${consumptionEmissions.toFixed(0)} kg CO2e</p>
    `;

    // --- Generate Personalized Tips ---
    tipsUl.innerHTML = ''; // Clear previous tips

    if (mode === 'car_gasoline' && distance > 5) {
        tipsUl.innerHTML += `<li>Consider switching some car trips to public transport, cycling, or walking to significantly reduce transport emissions.</li>`;
    }
    if (transportEmissions > totalEmissions * 0.4) { // If transport is > 40%
         tipsUl.innerHTML += `<li>Your transport footprint is a major contributor. Explore options like carpooling, more efficient vehicles, or reducing flights if applicable.</li>`;
    }
     if (flightsShort > 1 || flightsLong > 0) {
        tipsUl.innerHTML += `<li>Air travel has a high impact. Consider trains for shorter distances or offsetting flight emissions.</li>`;
    }

     if (electricity > 400 && renewables !== 'yes_full') {
        tipsUl.innerHTML += `<li>Your electricity usage is relatively high. Look into energy-efficient appliances, LED lighting, and unplugging devices. Switching to a green energy provider can also help.</li>`;
    }
     if (heating !== 'none' && renewables !== 'yes_full' && energyEmissions > totalEmissions * 0.3) {
         tipsUl.innerHTML += `<li>Home heating is a significant part of your energy footprint. Ensure good insulation, check thermostat settings, and explore renewable heating options if feasible.</li>`;
     }
      if (renewables === 'no') {
        tipsUl.innerHTML += `<li>Explore switching to a renewable energy tariff from your provider or investigate installing solar panels if you own your home.</li>`;
    }


    if (diet === 'meat_heavy') {
        tipsUl.innerHTML += `<li>Reducing meat consumption, especially red meat, can drastically lower your dietary footprint. Try incorporating more plant-based meals.</li>`;
    }
    if (waste === 'high') {
        tipsUl.innerHTML += `<li>Focus on reducing waste: refuse single-use items, buy in bulk, repair items, and maximize recycling and composting.</li>`;
    }

    if (tipsUl.innerHTML === '') {
        tipsUl.innerHTML = '<li>Great job! Your estimated footprint seems relatively low based on these inputs. Keep up the sustainable habits!</li>';
    }


    resultsDiv.style.display = 'block';
     // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    console.log("Calculation complete. Results displayed.");

}


console.log("Calculator script loaded.");