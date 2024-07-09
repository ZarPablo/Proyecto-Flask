document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactoForm');
    const tableBody = document.getElementById('contactosTable').querySelector('tbody');
    let isUpdating = false;

    const fetchContactos = async () => {
        const response = await fetch('https://pabloalbrecht.pythonanywhere.com/contactos');
        const contactos = await response.json();
        tableBody.innerHTML = '';
        contactos.forEach(contacto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contacto.id}</td>
                <td>${contacto.nombre}</td>
                <td>${contacto.direccion}</td>
                <td>${contacto.telefono}</td>
                <td>
                    <button onclick="editContacto(${contacto.id}, '${contacto.nombre}', '${contacto.direccion}', '${contacto.telefono}')">Editar</button>
                    <button onclick="deleteContacto(${contacto.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    const addContacto = async (contacto) => {
        await fetch('https://pabloalbrecht.pythonanywhere.com/agregar_contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contacto)
        });
        fetchContactos();
    };

    const updateContacto = async (id, contacto) => {
        await fetch(`https://pabloalbrecht.pythonanywhere.com/actualizar_contacto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contacto)
        });
        fetchContactos();
    };

    const deleteContacto = async (id) => {
        await fetch(`https://pabloalbrecht.pythonanywhere.com/eliminar_contacto/${id}`, {
            method: 'DELETE'
        });
        fetchContactos();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('contactoId').value;
        const nombre = document.getElementById('nombre').value;
        const direccion = document.getElementById('direccion').value;
        const telefono = document.getElementById('telefono').value;
        const contacto = { nombre, direccion, telefono };

        if (isUpdating) {
            updateContacto(id, contacto);
            isUpdating = false;
        } else {
            addContacto(contacto);
        }

        form.reset();
        document.getElementById('contactoId').value = '';
    });

    window.editContacto = (id, nombre, direccion, telefono) => {
        document.getElementById('contactoId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('direccion').value = direccion;
        document.getElementById('telefono').value = telefono;
        isUpdating = true;
    };

    window.deleteContacto = (id) => {
        if (confirm('¿Estás seguro de eliminar este contacto?')) {
            deleteContacto(id);
        }
    };

    fetchContactos();
});
