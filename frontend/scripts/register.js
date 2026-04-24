// register.js

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = { name, email, password };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful');
            window.location.href = 'login.html';  // Redirect to login page after successful registration
        } else {
            alert('Registration failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Error during registration');
    }
});
