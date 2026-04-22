document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    
    if (!token) {
        window.location.href = 'index.html'; // Redirect to login if no token is found
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/subscriptions?email=user1@gmail.com', { // Change with logged-in user's email
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Send the token with the request
            }
        });

        const data = await response.json();

        if (response.ok) {
            const subscriptionsDiv = document.getElementById('subscriptions');
            subscriptionsDiv.innerHTML = data.subscriptions.map(subscription => `<p>${subscription.title} by ${subscription.artist}</p>`).join('');

            const userNameElement = document.getElementById('user-name');
            userNameElement.innerText = 'Hello, ' + data.user.name;
        } else {
            alert("Error fetching subscriptions: " + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Error fetching data from backend.");
    }
});

// Logout function to clear the token and redirect to login
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html'; // Redirect to login page
}