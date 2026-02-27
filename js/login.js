const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

// Formularios
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

// --- ANIMACIONES DE LOS PANELES ---
btnSignIn.addEventListener("click", () => {
    container.classList.remove("toggle");
});
btnSignUp.addEventListener("click", () => {
    container.classList.add("toggle");
});

// --- LÓGICA DE REGISTRO ---
registerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    // Verificamos si el correo ya está registrado
    if (localStorage.getItem(email)) {
        alert("Este correo ya está registrado. Por favor, inicia sesión.");
        return;
    }

    // Guardamos el usuario en el localStorage
    const userData = {
        name: name,
        email: email,
        password: password // NOTA: En un servidor real, esto debe ir encriptado.
    };

    localStorage.setItem(email, JSON.stringify(userData));
    
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    registerForm.reset(); // Limpiamos el formulario
    
    // Movemos el panel al inicio de sesión automáticamente
    container.classList.remove("toggle");
});

// --- LÓGICA DE INICIO DE SESIÓN ---
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Buscamos al usuario en la "base de datos" del navegador
    const storedUser = localStorage.getItem(email);

    if (storedUser) {
        const userData = JSON.parse(storedUser);

        // Verificamos la contraseña
        if (userData.password === password) {
            alert(`¡Bienvenido de nuevo, ${userData.name}!`);
            
            // Guardamos quién inició sesión para usarlo en otras páginas
            sessionStorage.setItem("usuarioLogueado", userData.name);
            
            // Redirigimos al inicio de tu página
            window.location.href = "index.html"; 
        } else {
            alert("Contraseña incorrecta. Inténtalo de nuevo.");
        }
    } else {
        alert("No encontramos ninguna cuenta con este correo.");
    }
});