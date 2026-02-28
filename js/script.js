const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menu.addEventListener('click', ()=>{
    sidebar.classList.toggle('menu-toggle');
    menu.classList.toggle('menu-toggle');
    main.classList.toggle('menu-toggle');
});
// ... (tu código anterior del menú se queda igual) ...

// --- LÓGICA DEL MODAL DE BIENVENIDA ---
document.addEventListener("DOMContentLoaded", () => {
    const welcomeModal = document.getElementById('welcome-modal');
    const closeBtn = document.getElementById('close-welcome-btn');

    // Comprueba si el usuario ya aceptó las reglas antes
    if (!localStorage.getItem('plutonmc_rules_accepted')) {
        welcomeModal.style.display = 'flex'; // Muestra el modal
    }

    closeBtn.addEventListener('click', () => {
        welcomeModal.style.display = 'none'; // Oculta el modal
        localStorage.setItem('plutonmc_rules_accepted', 'true'); // Lo guarda para no volver a mostrarlo
    });

    // Cargar reseñas guardadas al iniciar la página
    loadReviews();
});

// --- LÓGICA DE LAS RESEÑAS (GUARDADO LOCAL) ---
const feedbackForm = document.getElementById('feedback-form');
const reviewsList = document.getElementById('reviews-list');

// Función para pintar una reseña en el HTML
function renderReview(nombre, calificacion, razon) {
    const newReview = document.createElement('div');
    newReview.classList.add('review-card');
    newReview.innerHTML = `
        <div class="review-header">
            <strong>${nombre}</strong>
            <span class="rating">⭐ ${calificacion}/10</span>
        </div>
        <p class="review-body">${razon}</p>
    `;
    reviewsList.prepend(newReview);
}

// Función para cargar reseñas guardadas en el navegador
function loadReviews() {
    const savedReviews = JSON.parse(localStorage.getItem('plutonmc_reviews')) || [];
    
    // Si hay reseñas guardadas, las mostramos
    if (savedReviews.length > 0) {
        // Limpiamos el HTML inicial para no duplicar la de Notch si ya hay datos
        reviewsList.innerHTML = ''; 
        // Renderizamos las guardadas
        savedReviews.forEach(review => renderReview(review.nombre, review.calificacion, review.razon));
    }
}

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const calificacion = document.getElementById('calificacion').value;
    const razon = document.getElementById('razon').value;

    // Mostramos la nueva reseña inmediatamente
    renderReview(nombre, calificacion, razon);

    // Guardamos la reseña en la memoria del navegador (localStorage)
    const savedReviews = JSON.parse(localStorage.getItem('plutonmc_reviews')) || [];
    
    // Agregamos la reseña por defecto de Notch si es la primera vez que guarda alguien
    if (savedReviews.length === 0) {
        savedReviews.push({nombre: 'Notch', calificacion: '10', razon: '¡Me encanta el servidor! El modo Factions es muy divertido y no hay lag.'});
    }
    
    // Agregamos la nueva
    savedReviews.push({nombre, calificacion, razon});
    localStorage.setItem('plutonmc_reviews', JSON.stringify(savedReviews));

    // Enviamos el correo a FormSubmit
    const formData = new FormData(feedbackForm);
    fetch(feedbackForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if(response.ok) {
            alert('¡Gracias por tu opinión! Tu comentario ha sido guardado.');
            feedbackForm.reset(); 
        } else {
            alert('Error en el correo, pero tu reseña se guardó en la página.');
        }
    })
    .catch(error => console.log(error));
});
