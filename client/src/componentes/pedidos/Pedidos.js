import React, { useEffect, useState, Fragment } from "react";
import clienteAxios from "../../config/axios";
import DetallesPedido from "./DetallesPedido";
import Swal from "sweetalert2";

function Pedidos() {
  const [pedidos, guardarPedidos] = useState([]);

  useEffect(() => {
    const consultarAPI = async () => {
      try {
        const resultado = await clienteAxios.get("/pedidos");
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
  }, []);

  const eliminarPedido = async (id) => {
    try {
      const resultado = await clienteAxios.delete(`/pedidos/${id}`);
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
