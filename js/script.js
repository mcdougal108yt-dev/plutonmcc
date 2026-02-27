const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menu.addEventListener('click', ()=>{
    sidebar.classList.toggle('menu-toggle');
    menu.classList.toggle('menu-toggle');
    main.classList.toggle('menu-toggle');
});
// ... (tu código anterior del menú se queda igual) ...

const feedbackForm = document.getElementById('feedback-form');
const reviewsList = document.getElementById('reviews-list');

feedbackForm.addEventListener('submit', function(e) {
    // Evitamos la redirección por defecto para manejar la vista aquí primero
    e.preventDefault();

    // Obtenemos los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const calificacion = document.getElementById('calificacion').value;
    const razon = document.getElementById('razon').value;

    // Creamos el HTML para la nueva reseña
    const newReview = document.createElement('div');
    newReview.classList.add('review-card');
    newReview.innerHTML = `
        <div class="review-header">
            <strong>${nombre}</strong>
            <span class="rating">⭐ ${calificacion}/10</span>
        </div>
        <p class="review-body">${razon}</p>
    `;

    // Añadimos la nueva reseña al inicio de la lista
    reviewsList.prepend(newReview);

    // Opcional: Enviamos los datos a FormSubmit usando Fetch (para no recargar la página)
    const formData = new FormData(feedbackForm);
    fetch(feedbackForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if(response.ok) {
            alert('¡Gracias por tu opinión! Tu comentario ha sido enviado y publicado.');
            feedbackForm.reset(); // Limpiamos el formulario
        } else {
            alert('Hubo un error al enviar el correo, pero tu reseña se agregó a la página.');
        }
    })
    .catch(error => console.log(error));
});