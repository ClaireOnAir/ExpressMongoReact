import React, { useEffect, useState, Fragment, useContext } from "react";
import clienteAxios from "../../config/axios";
import DetallesPedido from "./DetallesPedido";
import Swal from "sweetalert2";
import { CRMContext } from "../../context/CRMContext";
import { useNavigate } from "react-router-dom";

function Pedidos() {
  const [pedidos, guardarPedidos] = useState([]);
  const [auth, guardarAuth] = useContext(CRMContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!auth.auth || localStorage.getItem("token") !== auth.token) {
      navigate("/iniciar-sesion");
      return;
    }

    const consultarAPI = async () => {
      try {
        const resultado = await clienteAxios.get("/pedidos", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        console.log("Pedidos - resultado:", resultado.data);
        guardarPedidos(resultado.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al obtener los pedidos",
        });
      }
    };
    consultarAPI();
  }, [auth, navigate]);

  const eliminarPedido = async (id) => {
    try {
      const resultado = await clienteAxios.delete(`/pedidos/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log("Eliminar pedido - resultado:", resultado);
      if (resultado.status === 200) {
        Swal.fire("¡Eliminado!", "El pedido ha sido eliminado.", "success");
        guardarPedidos(pedidos.filter((pedido) => pedido._id !== id));
      } else {
        throw new Error("No se pudo eliminar el pedido");
      }
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al eliminar el pedido",
      });
    }
  };

  return (
    <Fragment>
      <ul className="listado-pedidos">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <DetallesPedido
              key={pedido._id}
              pedido={pedido}
              eliminarPedido={eliminarPedido}
            />
          ))
        ) : (
          <p>No hay pedidos para mostrar</p>
        )}
      </ul>
    </Fragment>
  );
}

export default Pedidos;
