document.getElementById('appstateForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const appstateResult = document.getElementById('appstateResult');

    // Clear previous error and result messages
    errorMessage.textContent = '';
    appstateResult.textContent = '';

    // Basic input validation
    if (!email || !password) {
        errorMessage.textContent = "Please fill out both fields.";
        return;
    }

    // Send the data to the server
    const response = await fetch('/generateAppstate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
        appstateResult.textContent = `Appstate: ${result.appstate}`;
    } else if (result.message === 'Invalid credentials') {
        errorMessage.textContent = "Wrong email or password. Please try again.";
    } else if (result.message === 'Account does not exist') {
        errorMessage.textContent = "Invalid account. Please check your credentials.";
    } else {
        errorMessage.textContent = "Error: " + result.message;
    }
});

// Show/Hide Password Toggle
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.textContent = 'Hide';
    } else {
        passwordField.type = 'password';
        toggleButton.textContent = 'Show';
    }
});