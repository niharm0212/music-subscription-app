// login.js

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const credentials = { email, password };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token);
            alert('Login successful');
            window.location.href = 'main.html';  // Redirect to main page after login
        } else {
            alert('Login failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login');
    }
});