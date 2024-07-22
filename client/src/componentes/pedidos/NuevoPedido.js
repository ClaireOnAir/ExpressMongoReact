import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import FormBuscarProducto from "./FormBuscarProducto";
import FormCantidadProducto from "./FormCantidadProducto";
import Swal from "sweetalert2";

function NuevoPedido() {
  // Extraer ID de cliente
  const { id } = useParams();

  // state
  const [cliente, guardarCliente] = useState({});
  const [busqueda, guardarBusqueda] = useState("");
  const [productos, guardarProductos] = useState([]);

  useEffect(() => {
    // obtener el cliente
    const consultarAPI = async () => {
      // consultar el cliente actual
      const resultado = await clienteAxios.get(`/clientes/${id}`);
      guardarCliente(resultado.data);
    };

    // llamar a la api
    consultarAPI();
  }, [id]);

  const buscarProducto = async (e) => {
    e.preventDefault();

    // obtener los productos de la busqueda
    const resultadoBusqueda = await clienteAxios.post(
      `/productos/busqueda/${busqueda}`
    );

    // si no hay resultados una alerta. contrario agregarlo al state
    if (resultadoBusqueda.data[0]) {
      let productoResultado = {
        ...resultadoBusqueda.data[0],
        cantidad: 0,
      };

      // ponerlo en el state
      guardarProductos([...productos, productoResultado]);
    } else {
      // no hay resultados
      Swal.fire({
        icon: "error",
        title: "No resultados",
        text: "No hay resultados",
      });
    }
  };

  // almacenar una busqueda en el state
  const leerDatosBusqueda = (e) => {
    guardarBusqueda(e.target.value);
  };

  return (
    <Fragment>
      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>
          Nombre: {cliente.nombre} {cliente.apellido}
        </p>
        <p>Telefono: {cliente.telefono}</p>
      </div>

      <FormBuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        {productos.map((producto, index) => (
          <FormCantidadProducto
            key={producto._id}
            producto={producto}
            guardarProductos={guardarProductos}
            productos={productos}
          />
        ))}
      </ul>

      <div className="campo">
        <label>Total:</label>
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          readOnly="readonly"
        />
      </div>
      <div className="enviar">
        <input type="submit" className="btn btn-azul" value="Agregar Pedido" />
      </div>
    </Fragment>
  );
}

export default NuevoPedido;
