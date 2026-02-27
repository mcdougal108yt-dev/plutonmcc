const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menu.addEventListener('click', ()=>{
    sidebar.classList.toggle('menu-toggle');
    menu.classList.toggle('menu-toggle');
    main.classList.toggle('menu-toggle');
});
// Capturamos el formulario de soporte
const supportForm = document.getElementById('support-form');

if(supportForm) {
    supportForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Evitamos que la página recargue o cambie
        
        // Cambiamos el texto del botón temporalmente
        const btnSubmit = supportForm.querySelector('.btn-submit');
        const originalText = btnSubmit.textContent;
        btnSubmit.textContent = 'Enviando...';
        btnSubmit.disabled = true;

        const formData = new FormData(supportForm);

        // Enviamos los datos usando Fetch
        fetch(supportForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if(response.ok) {
                alert('¡Mensaje enviado con éxito! Nuestro equipo de soporte te responderá por correo pronto.');
                supportForm.reset(); // Limpia el formulario
            } else {
                alert('Hubo un error al enviar el mensaje. Por favor, intenta usar nuestro Discord.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error de conexión.');
        })
        .finally(() => {
            // Restauramos el botón
            btnSubmit.textContent = originalText;
            btnSubmit.disabled = false;
        });
    });
}