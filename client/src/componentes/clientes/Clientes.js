import React, { useEffect, useState, Fragment, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Cliente from "./Cliente";
import Spinner from "../layout/Spinner";
import { CRMContext } from "../../context/CRMContext";

function Clientes() {
  const [clientes, guardarClientes] = useState([]);
  const [auth, guardarAuth] = useContext(CRMContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!auth.auth || localStorage.getItem("token") !== auth.token) {
      navigate("/iniciar-sesion");
      return;
    }

    const consultarAPI = async () => {
      try {
        const clientesConsulta = await clienteAxios.get("/clientes", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        guardarClientes(clientesConsulta.data);
      } catch (error) {
        if (error.response.status === 500) {
          navigate("/iniciar-sesion");
        }
      }
    };

    consultarAPI();
  }, [auth, navigate]);

  if (!clientes.length) return <Spinner />;

  const eliminarClienteDelEstado = (idCliente) => {
    const nuevosClientes = clientes.filter(
      (cliente) => cliente._id !== idCliente
    );
    guardarClientes(nuevosClientes);
  };

  return (
    <Fragment>
      <h2>Clientes</h2>
      <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map((cliente) => (
          <Cliente
            key={cliente._id}
            cliente={cliente}
            eliminarClienteDelEstado={eliminarClienteDelEstado}
          />
        ))}
      </ul>
    </Fragment>
  );
}

export default Clientes;
