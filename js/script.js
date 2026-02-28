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

// ... (tu código del menú y el modal de bienvenida se quedan igual) ...

// --- LÓGICA DE LAS RESEÑAS (MOCKAPI) ---
const API_URL = 'https://69a25d27be843d692bd148c1.mockapi.io/feedback';
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
    reviewsList.prepend(newReview); // prepend pone el comentario más nuevo arriba
}

// Función para cargar reseñas guardadas en la base de datos (MockAPI)
async function loadReviews() {
    try {
        const response = await fetch(API_URL);
        const savedReviews = await response.json();
        
        // Si hay reseñas guardadas en la API, las mostramos
        if (savedReviews.length > 0) {
            reviewsList.innerHTML = ''; // Limpiamos el HTML para quitar la de Notch
            
            // Renderizamos todas las reseñas de la base de datos
            savedReviews.forEach(review => renderReview(review.nombre, review.calificacion, review.razon));
        }
    } catch (error) {
        console.error("Error al cargar las reseñas de la base de datos:", error);
    }
}

// Enviar una nueva reseña a la base de datos
feedbackForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const calificacion = document.getElementById('calificacion').value;
    const razon = document.getElementById('razon').value;
    const btnSubmit = feedbackForm.querySelector('.btn-submit');

    // Cambiamos el texto del botón mientras se envía para que el usuario no dé doble clic
    btnSubmit.textContent = 'Enviando...';
    btnSubmit.disabled = true;

    // Preparamos los datos a enviar a MockAPI
    const newFeedback = {
        nombre: nombre,
        calificacion: calificacion,
        razon: razon
    };

    try {
        // Hacemos el POST a MockAPI
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFeedback)
        });

        if(response.ok) {
            // Si la base de datos la guardó con éxito
            const savedReview = await response.json();
            
            // Si la lista solo tenía a Notch, la limpiamos antes de agregar la primera real
            if (reviewsList.innerHTML.includes('Notch')) {
                reviewsList.innerHTML = '';
            }

            // Mostramos la reseña en la página
            renderReview(savedReview.nombre, savedReview.calificacion, savedReview.razon);
            
            alert('¡Gracias por tu opinión! Tu comentario ya es visible para todos.');
            feedbackForm.reset(); 
        } else {
            alert('Hubo un error al guardar tu reseña en la base de datos.');
        }
    } catch (error) {
        console.error("Error:", error);
        alert('Error de conexión. Inténtalo más tarde.');
    } finally {
        // Restauramos el botón
        btnSubmit.textContent = 'Enviar Feedback';
        btnSubmit.disabled = false;
    }
});
