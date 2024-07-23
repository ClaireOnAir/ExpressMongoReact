import React, { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";

function DetallesPedido({ pedido, eliminarPedido }) {
  const { cliente, pedido: articulosPedido, total } = pedido || {};
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosActualizados = await Promise.all(
        articulosPedido.map(async (articulo) => {
          if (!articulo.producto) {
            const resultado = await clienteAxios.get(
              `/productos/${articulo._id}`
            );
            return { ...articulo, producto: resultado.data };
          }
          return articulo;
        })
      );
      setProductos(productosActualizados);
    };

    if (articulosPedido && articulosPedido.length > 0) {
      fetchProductos();
    }
  }, [articulosPedido]);

  if (!cliente || productos.length === 0) {
    return (
      <li className="pedido">
        <p>Información de pedido incompleta</p>
      </li>
    );
  }

  const handleEliminar = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarPedido(pedido._id);
      }
    });
  };

  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: {pedido?._id || "N/A"}</p>
        <p className="nombre">
          Cliente: {cliente.nombre} {cliente.apellido}
        </p>

        <div className="articulos-pedido">
          <p className="productos">Artículos Pedido: </p>
          <ul>
            {productos.map((articulo, index) => {
              const producto = articulo.producto || {};
              return (
                <li key={producto._id || index}>
                  <p>{producto.nombre || "Nombre no disponible"}</p>
                  <p>
                    Precio: $
                    {producto.precio !== undefined ? producto.precio : "N/A"}
                  </p>
                  <p>Cantidad: {articulo.cantidad || "N/A"}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="total">Total: ${total} </p>
      </div>
      <div className="acciones">
        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={handleEliminar}
        >
          <i className="fas fa-times"></i>
          Eliminar Pedido
        </button>
      </div>
    </li>
  );
}

export default DetallesPedido;
