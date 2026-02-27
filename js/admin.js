// Cargar compras al iniciar la página
document.addEventListener('DOMContentLoaded', cargarTabla);

function cargarTabla() {
    const tbody = document.getElementById('tabla-body');
    const historial = JSON.parse(localStorage.getItem('historialCompras')) || [];

    tbody.innerHTML = ''; // Limpiamos la tabla

    if (historial.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay compras registradas aún.</td></tr>`;
        return;
    }

    // Invertimos el array para ver lo más reciente arriba
    historial.reverse().forEach(compra => {
        // Determinamos el color de la etiqueta de estado
        let badgeClass = '';
        if(compra.estado === 'Pendiente') badgeClass = 'pendiente';
        if(compra.estado === 'Aprobado') badgeClass = 'aprobado';
        if(compra.estado === 'Rechazado') badgeClass = 'rechazado';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${compra.fecha}</td>
            <td><strong>${compra.mc}</strong><br><small>${compra.discord}</small></td>
            <td>${compra.rango}<br><small>${compra.duracion} (${compra.precio})</small></td>
            <td>${compra.metodo}</td>
            <td style="font-family: monospace;">${compra.transaccion}</td>
            <td><span class="badge ${badgeClass}">${compra.estado}</span></td>
            <td>
                ${compra.estado === 'Pendiente' ? `
                    <button class="btn-success" onclick="cambiarEstado(${compra.id}, 'Aprobado')">✔</button>
                    <button class="btn-danger" onclick="cambiarEstado(${compra.id}, 'Rechazado')">✖</button>
                ` : '<span>Procesado</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function cambiarEstado(id, nuevoEstado) {
    let historial = JSON.parse(localStorage.getItem('historialCompras')) || [];
    
    // Buscamos la compra por su ID y le cambiamos el estado
    historial = historial.map(compra => {
        if (compra.id === id) {
            compra.estado = nuevoEstado;
        }
        return compra;
    });

    localStorage.setItem('historialCompras', JSON.stringify(historial));
    cargarTabla(); // Recargamos la tabla para ver los cambios
}

function limpiarHistorial() {
    if(confirm('¿Estás seguro de que deseas borrar todo el registro de compras? Esto no se puede deshacer.')) {
        localStorage.removeItem('historialCompras');
        cargarTabla();
    }
}