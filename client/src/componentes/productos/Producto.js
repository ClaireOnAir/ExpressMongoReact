import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

function Producto({ producto }) {
    // Elimina un producto
    const eliminarProducto = id => {
        Swal.fire({
            title: "Estás seguro?",
            text: "Una vez eliminado no se podrá recuperar!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!",
            cancelButtonText : "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // eliminar en la rest api
                clienteAxios.delete(`/productos/${id}`)
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire(
                                'Eliminado',
                                res.data.mensaje,
                                'success'
                            );
                        }
                    })
                    .catch(error => {
                        console.error("Hubo un problema al eliminar el producto:", error);
                        Swal.fire(
                            'Error',
                            'Hubo un problema al eliminar el producto. Por favor, inténtalo de nuevo más tarde.',
                            'error'
                        );
                    });
            }
        });
    };

    const { _id, nombre, precio, imagen } = producto;

    return (
        <li className="producto">
            <div className="info-producto">
                <p className="nombre">{nombre}</p>
                <p className="precio">$ {precio} </p>
                {imagen ? (
                    <img src={`http://localhost:5000/uploads/${imagen}`} alt={nombre} />
                ) : (
                    <p>Imagen no disponible</p>
                )}
            </div>
            <div className="acciones">
                <Link to = {`/productos/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Producto
                </Link>

                <button type="button" className="btn btn-rojo btn-eliminar" onClick={ () => eliminarProducto(_id) }>
                    <i className="fas fa-times"></i>
                    Eliminar Producto
                </button>
            </div>
        </li>
    );
}

export default Producto;



