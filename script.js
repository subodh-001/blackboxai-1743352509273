// Form validation for prediction form
document.addEventListener('DOMContentLoaded', function() {
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = predictionForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Calculating...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Store form data in localStorage to use on results page
                const formData = {
                    location: document.getElementById('location').value,
                    propertyType: document.getElementById('propertyType').value,
                    area: document.getElementById('area').value,
                    age: document.getElementById('age').value,
                    bedrooms: document.getElementById('bedrooms').value,
                    bathrooms: document.getElementById('bathrooms').value
                };
                localStorage.setItem('propertyData', JSON.stringify(formData));
                
                // Redirect to results page
                window.location.href = 'results.html';
            }, 2000);
        });
    }

    // If on results page, load the stored data
    if (window.location.pathname.includes('results.html')) {
        const propertyData = JSON.parse(localStorage.getItem('propertyData'));
        if (propertyData) {
            // Update the property details on the page
            document.querySelector('.value-card p').textContent = 
                `${propertyData.bedrooms} BHK ${propertyData.propertyType.charAt(0).toUpperCase() + propertyData.propertyType.slice(1)} in ${propertyData.location} (${propertyData.area} sq. ft.)`;
            
            // Generate and display mock valuation
            const valuation = generateMockPrice(propertyData.area, propertyData.location, propertyData.propertyType);
            document.querySelector('.value-card .text-5xl').textContent = `₹${(valuation/10000000).toFixed(2)} Crore`;
            
            // Update price per sq. ft.
            const pricePerSqft = Math.round(valuation/propertyData.area);
            document.querySelector('.grid-cols-3 > div:nth-child(1) p.text-2xl').textContent = `₹${pricePerSqft.toLocaleString()}`;
        }
    }
});

// Function to generate random price based on inputs (mock)
function generateMockPrice(area, location, propertyType) {
    let basePrice;
    switch(location.toLowerCase()) {
        case 'mumbai': basePrice = 25000; break;
        case 'delhi': basePrice = 18000; break;
        case 'bangalore': basePrice = 12000; break;
        case 'hyderabad': basePrice = 10000; break;
        case 'chennai': basePrice = 9000; break;
        default: basePrice = 15000;
    }

    // Adjust for property type
    switch(propertyType.toLowerCase()) {
        case 'villa': basePrice *= 1.3; break;
        case 'commercial': basePrice *= 1.5; break;
        case 'plot': basePrice *= 0.7; break;
    }

    // Add some randomness
    const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
    return Math.round(area * basePrice * randomFactor);
}