import React from "react";

function FormCantidadProducto({ producto, guardarProductos, productos }) {
  const actualizarCantidad = (e) => {
    const nuevaCantidad = parseInt(e.target.value);
    const productosActualizados = productos.map((productoState) =>
      productoState._id === producto._id
        ? { ...productoState, cantidad: nuevaCantidad }
        : productoState
    );

    guardarProductos(productosActualizados);
  };

  const eliminarProducto = () => {
    const productosActualizados = productos.filter(
      (productoState) => productoState._id !== producto._id
    );

    guardarProductos(productosActualizados);
  };

  return (
    <li>
      <div className="texto-producto">
        <p className="nombre">{producto.nombre}</p>
        <p className="precio">${producto.precio}</p>
      </div>
      <div className="acciones">
        <div className="contenedor-cantidad">
          <i className="fas fa-minus"></i>
          <input
            type="number"
            name="cantidad"
            value={producto.cantidad}
            onChange={actualizarCantidad}
          />
          <i className="fas fa-plus"></i>
        </div>
        <button
          type="button"
          className="btn btn-rojo"
          onClick={eliminarProducto}
        >
          <i className="fas fa-minus-circle"></i>
          Eliminar Producto
        </button>
      </div>
    </li>
  );
}

export default FormCantidadProducto;
