const splash = document.getElementById('splash');
const container = document.getElementById('container');

// Show login form after splash screen
setTimeout(() => {
    splash.classList.add('hidden');
    setTimeout(() => {
        container.classList.add('show');
    }, 700);
}, 3200); // 3.2 seconds splash screen


const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";   // Show password
  } else {
    passwordInput.type = "password"; // Hide password
  }
});


// Form switching
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});


// Simple form validation & fake feedback
function showMessage(elementId, text, type = 'error') {
    const el = document.getElementById(elementId);
    el.textContent = text;
    el.className = `message ${type}`;
    el.style.display = 'block';
    
    setTimeout(() => {
        el.style.display = 'none';
    }, 3800);
}

document.getElementById('login').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage('loginError', 'Please fill in all fields');
        return;
    }

    // Fake successful login
    showMessage('loginSuccess', 'Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
        alert('Welcome to MusicFlow! 🎵');
        // window.location.href = '/dashboard.html'; // real redirect
    }, 1500);
});

document.getElementById('register').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirmPassword').value;

    if (!email || !password || !confirm) {
        showMessage('registerError', 'Please fill in all fields');
        return;
    }

    if (password !== confirm) {
        showMessage('registerError', 'Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showMessage('registerError', 'Password must be at least 6 characters');
        return;
    }

    showMessage('registerSuccess', 'Registration successful! You can now log in', 'success');
    
    setTimeout(() => {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    }, 1800);
});
let hiddenForm = document.getElementById("container");
let submitBtn = document.getElementById("btn-login");
let userName = document.getElementById("loginEmail");
console.log(submitBtn);
hiddenForm.style.display = "block"
function loginRegister() {
hiddenForm.style.display = "none"


}
submitBtn.addEventListener("click", loginRegister)