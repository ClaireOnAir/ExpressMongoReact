import React, {useState, useEffect, Fragment} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';

function EditarProducto () {

    // Obtener el ID
    const { id } = useParams();

    // producto = state, y funcion para actualizar
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    });

    const [archivo, guardarArchivo] = useState('');

    // cuando el componente carga
    useEffect(() => {
        // consultar la api para traer el producto a editar
        const consultarAPI = async () => {
            try {
                const productoConsulta = await clienteAxios.get(`/productos/${id}`);
                guardarProducto(productoConsulta.data);
            } catch (error) {
                console.error("Error al consultar la API", error);
                Swal.fire('Error', 'Hubo un problema al obtener los datos del producto', 'error');
            }
        };
        consultarAPI();
    }, [id]);

    const leerInformacionProducto = e => {
        guardarProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    }

    const leerArchivo = e => {
        guardarArchivo(e.target.files[0]);
    }

    // extraer los valroes del state
    const {nombre, precio, imagen} = producto;


    return(
        <Fragment>
            <h2>Editar Producto</h2>
            <form>
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
                        value="Confirmar Edición" 
                    />
                </div>
            </form>
        </Fragment>
    );
}

export default EditarProducto;