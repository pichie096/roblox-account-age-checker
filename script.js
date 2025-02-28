// Function to check Roblox account age
async function checkAccount() {
    const username = document.getElementById('username').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!username) {
        showError("Please enter a Roblox username");
        return;
    }
    
    resultDiv.innerHTML = '<p>Loading...</p>';
    resultDiv.style.display = 'block';
    
    try {
        // Use the newer users API endpoint with CORS proxy
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const userIdResponse = await fetch(`${proxyUrl}https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`);
        const userIdData = await userIdResponse.json();
        
        // Look for exact username match
        const userMatch = userIdData.data.find(user => 
            user.name.toLowerCase() === username.toLowerCase()
        );
        
        if (!userMatch) {
            showError(`Could not find user: ${username}`);
            return;
        }
        
        const userId = userMatch.id;
        
        // Now get the user's profile info
        const profileResponse = await fetch(`${proxyUrl}https://users.roblox.com/v1/users/${userId}`);
        const profileData = await profileResponse.json();
        
        if (!profileData || !profileData.created) {
            showError("Could not retrieve user information");
            return;
        }
        
        // Calculate account age
        const createdDate = new Date(profileData.created);
        const currentDate = new Date();
        const accountAgeInDays = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
        const years = Math.floor(accountAgeInDays / 365);
        const months = Math.floor((accountAgeInDays % 365) / 30);
        const days = accountAgeInDays % 30;
        
        // Get additional account info
        const displayName = profileData.displayName || username;
        const description = profileData.description || "No description";
        
        // Create result HTML
        resultDiv.innerHTML = `
            <div class="user-card">
                <h2>${displayName} (@${username})</h2>
                <p><strong>Account Created:</strong> ${createdDate.toLocaleDateString()}</p>
                <p><strong>Account Age:</strong> ${years} years, ${months} months, ${days} days</p>
                <p><strong>User ID:</strong> ${userId}</p>
                <p><strong>About:</strong> ${description}</p>
            </div>
        `;
        
        // Add some styling to the result
        const userCard = resultDiv.querySelector('.user-card');
        if (userCard) {
            userCard.style.border = '1px solid #ddd';
            userCard.style.padding = '15px';
            userCard.style.borderRadius = '5px';
            userCard.style.backgroundColor = '#f9f9f9';
            userCard.style.textAlign = 'left';
        }
        
    } catch (error) {
        console.error("Detailed error:", error);
        showError("An error occurred while fetching the data. Please try again later.");
    }
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p class="error">${message}</p>`;
    resultDiv.style.display = 'block';
    
    const errorElement = resultDiv.querySelector('.error');
    if (errorElement) {
        errorElement.style.color = 'red';
        errorElement.style.fontWeight = 'bold';
    }
}
