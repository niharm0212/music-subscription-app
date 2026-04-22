const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
        localStorage.setItem('token', data.token); // Save token in local storage
        window.location.href = 'index.html'; // Redirect to main page
    } else {
        alert('Invalid email or password!');
    }
});