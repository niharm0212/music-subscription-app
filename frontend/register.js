const form = document.getElementById("register-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Make a POST request to the backend register endpoint
  const response = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  const result = await response.json();

  if (response.ok) {
    alert("Registration successful!");
    window.location.href = "/login.html"; // Redirect to login page after successful registration
  } else {
    alert(`Error: ${result.message}`);
  }
});