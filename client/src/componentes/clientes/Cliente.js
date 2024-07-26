import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

function Cliente({ cliente, eliminarClienteDelEstado }) {
  // Extraer valores
  const { _id, nombre, apellido, empresa, email, telefono } = cliente;

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

  // Eliminar cliente
  const eliminarCliente = (idCliente) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Un cliente eliminado no se podrá recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamado a axios
        clienteAxios
          .delete(`/clientes/${idCliente}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          })
          .then((res) => {
            Swal.fire({
              title: "Eliminado!",
              text: res.data.mensaje,
              icon: "success",
            });
            eliminarClienteDelEstado(idCliente); // Actualizar estado en el frontend
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              Swal.fire({
                title: "Error!",
                text: "No estás autorizado para realizar esta acción",
                icon: "error",
              }).then(() => {
                navigate("/iniciar-sesion");
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Hubo un problema al eliminar el cliente",
                icon: "error",
              });
            }
          });
      }
    });
  };

  return (
    <li className="cliente">
      <div className="info-cliente">
        <p className="nombre">
          {nombre} {apellido}
        </p>
        <p className="empresa">{empresa}</p>
        <p>{email}</p>
        <p>Tel: {telefono}</p>
      </div>
      <div className="acciones">
        <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Cliente
        </Link>

        <Link to={`/pedidos/nuevo/${_id}`} className="btn btn-amarillo">
          <i className="fas fa-plus"></i>
          Nuevo pedido
        </Link>

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarCliente(_id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Cliente
        </button>
      </div>
    </li>
  );
}

export default Cliente;
