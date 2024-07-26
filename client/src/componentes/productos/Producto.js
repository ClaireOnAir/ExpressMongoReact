import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

function Producto({ producto, eliminarProductoDelEstado }) {
  // utilizar valores del context
  const [auth, guardarAuth] = useContext(CRMContext);

  // Navegación
  let navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!auth.auth || localStorage.getItem("token") !== auth.token) {
      navigate("/iniciar-sesion");
    }
  }, [auth, navigate]);

  // Elimina un producto
  const eliminarProducto = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado no se podrá recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // eliminar en la rest api
        clienteAxios
          .delete(`/productos/${id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              Swal.fire("Eliminado", res.data.mensaje, "success");
              eliminarProductoDelEstado(id); // Actualizar el estado en el frontend
            }
          })
          .catch((error) => {
            console.error("Hubo un problema al eliminar el producto:", error);
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar el producto. Por favor, inténtalo de nuevo más tarde.",
              "error"
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
        <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Producto
        </Link>

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarProducto(_id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Producto
        </button>
      </div>
    </li>
  );
}

export default Producto;
