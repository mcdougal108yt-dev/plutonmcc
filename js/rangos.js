const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menu.addEventListener('click', ()=>{
    sidebar.classList.toggle('menu-toggle');
    menu.classList.toggle('menu-toggle');
    main.classList.toggle('menu-toggle');
});

// Precios de los rangos
const precios = {
    rank_rookie: { '1 Semana': 0.26, '1 Mes': 0.52, '1 Año': 1.16, 'Permanente': 1.55 },
    rank_hunter: { '1 Semana': 0.39, '1 Mes': 0.90, '1 Año': 1.94, 'Permanente': 2.58 },
    rank_slayer: { '1 Semana': 0.65, '1 Mes': 1.29, '1 Año': 2.84, 'Permanente': 3.87 },
    rank_warlord: { '1 Semana': 1.03, '1 Mes': 2.19, '1 Año': 4.91, 'Permanente': 6.45 },
    rank_overlord: { '1 Semana': 1.55, '1 Mes': 3.61, '1 Año': 7.75, 'Permanente': 10.33 }
};

let compra = {};

function abrirModal(id, nombre) {
    compra = { id, nombre };
    const container = document.getElementById('container-duraciones');
    container.innerHTML = '';
    
    Object.keys(precios[id]).forEach(dur => {
        const p = precios[id][dur];
        container.innerHTML += `
            <div class="duracion-card" onclick="seleccionarDuracion('${dur}', ${p})">
                <h4>${dur}</h4>
                <p>$${p} USD</p>
            </div>`;
    });
    
    document.getElementById('modal-title-step1').innerText = `Seleccionar Duración - ${nombre}`;
    document.getElementById('modal-compra').style.display = 'flex';
    mostrarPaso(1);
}

function seleccionarDuracion(dur, precio) {
    compra.duracion = dur;
    compra.precio = `$${precio} USD`;
    document.getElementById('resumen-rango-2').innerText = `${compra.nombre} - ${dur}`;
    document.getElementById('resumen-precio-2').innerText = compra.precio;
    mostrarPaso(2);
}

function irPaso3(e) {
    e.preventDefault();
    compra.mc = document.getElementById('mc-user').value;
    compra.dc = document.getElementById('discord-user').value;
    compra.email = document.getElementById('email-user').value;
    
    document.getElementById('resumen-p3').innerHTML = `
        <p><strong>Usuario:</strong> ${compra.mc}</p>
        <p><strong>Rango:</strong> ${compra.nombre} (${compra.duracion})</p>
    `;
    mostrarPaso(3);
}

function irPasoCriptoSeleccion() { 
    mostrarPaso('cripto-sel'); 
}

function irPaso4(metodo) {
    compra.metodo = metodo;
    document.getElementById('nombre-metodo').innerText = metodo;
    document.getElementById('resumen-final-detalles').innerHTML = `
        <p><strong>MC:</strong> ${compra.mc} | <strong>Rango:</strong> ${compra.nombre}</p>
        <p><strong>Precio Total:</strong> ${compra.precio}</p>
    `;

    const infoDiv = document.getElementById('info-pago-especifica');
    const backBtn = document.getElementById('back-to-last');

    // Pago por Nequi
    if (metodo === 'Nequi') {
        backBtn.onclick = () => mostrarPaso(3);
        infoDiv.innerHTML = `
            <div class="qr-container"><img src="/imagenes/nequi.jpeg" alt="QR"></div>
            <p class="numero-nequi">Número: 3246207648</p>
            <div class="instrucciones-pago">
                <ol>
                    <li>Escanea el QR o envía al número arriba</li>
                    <li>Envía el monto equivalente en COP si es necesario</li>
                </ol>
            </div>`;
            
    // Pago por Cripto
    } else if (metodo.includes('Bitcoin') || metodo.includes('Litecoin') || metodo.includes('USDT')) {
        backBtn.onclick = () => mostrarPaso('cripto-sel');
        
        let walletAddress = "";
        if (metodo.includes('Bitcoin')) walletAddress = "bc1qldxwrpssl2x67c4ykh7g5xf2ydnnkw330ppnjd";
        else if (metodo.includes('Litecoin')) walletAddress = "LMmiFfwJ2AGxkfcuoG9qaWiFqtNYKbXrTF";
        else if (metodo.includes('USDT')) walletAddress = "0xD6aC57427a0b2ce21d69b5002b38bFC6eD04302c";

        infoDiv.innerHTML = `
            <div class="instrucciones-pago">
                <h4>Transferencia Cripto</h4>
                <p>Envía tu pago a la siguiente dirección de <strong>${metodo}</strong>:</p>
                <div style="background: #000; padding: 12px; border: 1px solid #2a2a30; border-radius: 6px; margin: 10px 0; font-family: monospace; word-break: break-all; color: #9c73ff; font-size: 1.1rem; text-align: center;">
                    ${walletAddress}
                </div>
                <p style="font-size: 0.85rem; color: #888;">Una vez confirmada, ingresa el ID de transacción abajo.</p>
            </div>`;
            
    // Pago por PayPal
    } else {
        backBtn.onclick = () => mostrarPaso(3);
        infoDiv.innerHTML = `<a href="https://paypal.me/Sax853" target="_blank" class="btn-pago-directo">Pagar con PayPal (${compra.precio})</a>`;
    }

    mostrarPaso(4);
}

function mostrarPaso(p) {
    document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
    document.getElementById(typeof p === 'number' ? `step-${p}` : `step-${p}`).classList.add('active');
}

function cerrarModal() { 
    document.getElementById('modal-compra').style.display = 'none'; 
}

// Función independiente para enviar la notificación a Discord
async function enviarADiscord(datos) {
const webhookURL = "https://discord.com/api/webhooks/1476797401573494894/sn1vpk9PYq8l2kSvGyT_MF1-BuOa7nugbhQoRww2wV788LGR49maTbU9EX2T7hJJulFb"; // Tu URL original

    const mensaje = {
        username: "PlutonMC Store",
        avatar_url: "https://media.discordapp.net/attachments/1449540177851715837/1476797574827606022/plutoncm-removebg-preview_1_1.png",
        content: "@everyone @here 🚨 **¡Atención Staff! Una nueva intención de compra ha sido registrada.**", // <-- AQUÍ SE AGREGA LA MENCIÓN
        embeds: [{
            title: "🛒 ¡Nueva Intención de Compra!",
            color: 5814783,
            fields: [
                { name: "Usuario MC", value: datos.mc || "No especificado", inline: true },
                { name: "Discord", value: datos.discord || "No especificado", inline: true },
                { name: "Rango", value: `${datos.rango} (${datos.duracion})`, inline: false },
                { name: "Precio", value: datos.precio || "0", inline: true },
                { name: "Método", value: datos.metodo || "No especificado", inline: true },
                { name: "ID Transacción", value: `\`${datos.transaccion}\``, inline: false }
            ],
            footer: { text: "Revisa el panel de admin para aprobar" },
            timestamp: new Date().toISOString() // Formato correcto para la hora en Discord
        }]
    };

    // Hacemos la petición POST al Webhook
    await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mensaje)
    });
}

// Función que se llama al hacer clic en el botón de finalizar
async function finalizarTodo(e) { 
    if(e) e.preventDefault();

    // Buscamos el input donde el usuario escribe el ID de la transacción
    // NOTA: Asegúrate de que en tu HTML de pago tengas un input con id="id-transaccion"
    const inputTransaccion = document.getElementById('id-transaccion');
    const transaccionVal = inputTransaccion && inputTransaccion.value.trim() !== "" 
        ? inputTransaccion.value 
        : "Sin ID de transacción";

    // Preparamos los datos extrayéndolos del objeto global 'compra'
    const datosCompra = {
        mc: compra.mc,
        discord: compra.dc,
        rango: compra.nombre,
        duracion: compra.duracion,
        precio: compra.precio,
        metodo: compra.metodo,
        transaccion: transaccionVal
    };

    try {
        // Ejecutamos la función de Discord y esperamos a que termine
        await enviarADiscord(datosCompra); 
        
        alert("¡Recibido! Notificamos al staff por Discord.");
        cerrarModal(); // Cerramos la ventana modal
    } catch (err) {
        console.error("Error al enviar el webhook:", err);
        alert("Hubo un error al enviar tu comprobante. Por favor, avísanos en el servidor de Discord.");
    }
}