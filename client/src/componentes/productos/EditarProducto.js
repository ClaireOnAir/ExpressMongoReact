import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';

function EditarProducto() {
    // Obtener el ID
    const { id } = useParams();

    // producto = state, y funcion para actualizar
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    });

    const [archivo, guardarArchivo] = useState('');
    const [cargando, setCargando] = useState(true); // Estado de carga
    let navigate = useNavigate();

    // cuando el componente carga
    useEffect(() => {
        // consultar la api para traer el producto a editar
        const consultarAPI = async () => {
            try {
                const productoConsulta = await clienteAxios.get(`/productos/${id}`);
                guardarProducto(productoConsulta.data);
                setCargando(false); // Cambio de estado de carga
            } catch (error) {
                console.error("Error al consultar la API", error);
                Swal.fire('Error', 'Hubo un problema al obtener los datos del producto', 'error');
            }
        };
        consultarAPI();
    }, [id]);

    // Edita un producto en la BBDD
    const editarProducto = async e => { 
        e.preventDefault();

        if (!producto.nombre || !producto.precio) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Nombre y precio son obligatorios',
            });
            return;
        }

        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        if (archivo) { 
            formData.append('imagen', archivo);
        }

        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200) {
                Swal.fire(
                    'Modificado Correctamente',
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

    const { nombre, precio, imagen } = producto;
    if (cargando) return <Spinner />; // Mostrar Spinner solo si cargando es true

    return (
        <Fragment>
            <h2>Editar Producto</h2>
            <form onSubmit={editarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre" 
                        onChange={leerInformacionProducto} 
                        defaultValue={nombre}
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
                        defaultValue={precio}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    { imagen ? ( 
                        <img src={`http://localhost:5000/uploads/${imagen}`} alt='imagen' width="300" />
                    ) : null }

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
                        value="Confirmar Edición" 
                    />
                </div>
            </form>
        </Fragment>
    );
}

export default EditarProducto;
