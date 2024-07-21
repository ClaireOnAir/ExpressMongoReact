import React, {Fragment, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import ClienteAxios from '../../config/axios';



function NuevoCliente ({history}) {
    // cliente = state, guardarCliente = funcion para guardar el state
    const [cliente, guardarCliente] = useState({
        nombre: '',
        apellido : '',
        empresa : '',
        email : '',
        telefono : ''
    });
    
    //  leer los datos del formulario
    const actualizarState = e => {
        // Almacenar lo que el usuario escribe en el state
        guardarCliente({
            // obtener una copia del state actual
            ...cliente, 
            [e.target.name] : e.target.value

        })
        console.log(cliente);
    }

    // Navegacion para la redireccion
    let navigate = useNavigate();

    // Añade en la REST API un cliente nuevo

    const agregarCliente = e => {
        e.preventDefault();

        // Enviar peticion en Axios
        ClienteAxios.post('/clientes', cliente)
        .then(res =>{
            // Validar si hay errores de mongo
            if(res.data.code === 11000) {
                Swal.fire({
                    type: 'error',
                    title: "Hubo un error",
                    text: 'Ese cliente ya está registrado',
                    icon: "error"
                  })

            }else {
                Swal.fire({
                    title: "Se agregó un Cliente",
                    text: res.data.mensaje,
                    icon: "success"
                  });
            }
            // Redireccionar
            navigate('/', {replace:true});
        });
    }


    //validar formulario
    const validarCliente =()=> {
        const{ nombre, apellido, email, empresa, telefono} = cliente;
        // Revisar que las propiedades del state tengan contenido

        let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length ;

        // retunr true o false
        return valido;

    }


    return(
        <Fragment>
            <h2>Nuevo Cliente</h2>
            <form onSubmit={agregarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Cliente" name="nombre" onChange={actualizarState}/>
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input type="text" placeholder="Apellido Cliente" name="apellido" onChange={actualizarState}/>
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input type="text" placeholder="Empresa Cliente" name="empresa" onChange={actualizarState}/>
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email" placeholder="Email Cliente" name="email" onChange={actualizarState}/>
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="tel" placeholder="Teléfono Cliente" name="telefono" onChange={actualizarState}/>
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Agregar Cliente" disabled={validarCliente()}/>
                </div>

            </form>

        </Fragment>

    )
}

// HOC, es una funcion que toma un componente y retorna un nuevo componente
export default NuevoCliente;