import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

function NuevoProducto() {

    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: ''
    });
    const [archivo, guardarArchivo] = useState('');

    let navigate = useNavigate();

    const agregarProducto = async e => {
        e.preventDefault();

        if (!producto.nombre || !producto.precio || !archivo) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos son obligatorios',
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        try {
            const res = await clienteAxios.post('/productos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201) {
                Swal.fire(
                    'Agregado Correctamente',
                    res.data.mensaje,
                    'success'
                ).then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                        navigate('/productos', { replace: true });
                    }
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Vuelva a intentarlo'
            });
        }
    }

    const leerInformacionProducto = e => {
        guardarProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    }

    const leerArchivo = e => {
        guardarArchivo(e.target.files[0]);
    }

    return (
        <Fragment>
            <h2>Nuevo Producto</h2>
            <form onSubmit={agregarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre" 
                        onChange={leerInformacionProducto} 
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input 
                        type="number" 
                        name="precio" 
                        min="0.00" 
                        step="1" 
                        placeholder="Precio" 
                        onChange={leerInformacionProducto} 
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    <input 
                        type="file"  
                        name="imagen" 
                        onChange={leerArchivo} 
                    />
                </div>

                <div className="enviar">
                    <input 
                        type="submit" 
                        className="btn btn-azul" 
                        value="Agregar Producto" 
                    />
                </div>
            </form>
        </Fragment>
    );
}

export default NuevoProducto;


