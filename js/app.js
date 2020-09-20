//Variables

const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');

const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {

    imprimirAlerta(mensaje, tipo){
        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase en base al tipo de error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje; 

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //Sacar la alerta después de 5 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas({citas}){

        this.limpiarHTML();
        
        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;
            
            //Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario: </span> ${propietario} 
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Teléfono de Contacto: </span> ${telefono} 
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha de la visita: </span> ${fecha} 
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora de la visita: </span> ${hora} 
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Síntomas o razón de la visita: </span> ${sintomas} 
            `;

            //Agregar el botón para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar turno <i class="far fa-window-close" id="cancel"></i>';
            
            btnEliminar.onclick = () => eliminarCita(id);

            //Agregar botón para editar el turno 
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <i class="fas fa-pen" id="pen"></i>';
            btnEditar.onclick = () => cargarEdicion(cita);

            //Agregar los párrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregar citas al HTML
            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

//Event Listeners

eventListeners();
function eventListeners(){
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

//Objeto con la información del turno médico veterinario

const citaObjeto = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

function datosCita(e){
    citaObjeto[e.target.name] = e.target.value;

}

//Valida y agrega un nuevo turno médico 

function nuevaCita(e){
    e.preventDefault();

    //Extraer la información del Objeto de cita
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObjeto;

    //Validar información
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado correctamente');

        //Pasar el objeto a modo edición

        administrarCitas.editarCita({...citaObjeto});

        //Volver el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        //Desactivar modo edición
        editando = false;

    } else {
        //Generar un id único

        citaObjeto.id = Date.now();

        //Creando una nueva cita

        administrarCitas.agregarCita({...citaObjeto});

        //Mensaje de agregado correctamente 
        ui.imprimirAlerta('Se agregó correctamente');
    }

    //Reiniciar el objeto para la validación
    reinicarObjeto();

    //Resetear el formulario 
    formulario.reset();

    //Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);
}

function reinicarObjeto(){
    citaObjeto.mascota = '';
    citaObjeto.propietario = '';
    citaObjeto.telefono = '';
    citaObjeto.fecha = '';
    citaObjeto.hora = '';
    citaObjeto.sintomas = '';
}

function eliminarCita(id){
    //Eliminar las citas

    administrarCitas.eliminarCita(id);

    //Mostrar un mensaje

    ui.imprimirAlerta('El turno se eliminó correctamente');
    
    //Refresca la página y los turnos
    ui.imprimirCitas(administrarCitas);
}

//Cargar los datos y el modo de edición

function cargarEdicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas} = cita;
    
    //Llenar los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el Objeto 
    citaObjeto.mascota = mascota;
    citaObjeto.propietario = propietario;
    citaObjeto.telefono = telefono;
    citaObjeto.fecha = fecha;
    citaObjeto.hora = hora;
    citaObjeto.sintomas = sintomas;

    //Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar';

    editando = true;
}