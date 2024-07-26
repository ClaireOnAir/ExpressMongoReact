import React, { useEffect, useState, Fragment, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Producto from "./Producto";
import Spinner from "../layout/Spinner";
import { CRMContext } from "../../context/CRMContext";

function Productos() {
  const [productos, guardarProductos] = useState([]);
  const [auth, guardarAuth] = useContext(CRMContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!auth.auth || localStorage.getItem("token") !== auth.token) {
      navigate("/iniciar-sesion");
      return;
    }

    const consultarAPI = async () => {
      try {
        const productosConsulta = await clienteAxios.get("/productos", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        guardarProductos(productosConsulta.data);
      } catch (error) {
        if (error.response.status === 500) {
          navigate("/iniciar-sesion");
        }
      }
    };

    consultarAPI();
  }, [auth, navigate]);

  if (!productos.length) return <Spinner />;

  const eliminarProductoDelEstado = (idProducto) => {
    const nuevosProductos = productos.filter(
      (producto) => producto._id !== idProducto
    );
    guardarProductos(nuevosProductos);
  };

  return (
    <Fragment>
      <h2>Productos</h2>
      <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Producto
      </Link>

      <ul className="listado-productos">
        {productos.map((producto) => (
          <Producto
            key={producto._id}
            producto={producto}
            eliminarProductoDelEstado={eliminarProductoDelEstado}
          />
        ))}
      </ul>
    </Fragment>
  );
}

export default Productos;
