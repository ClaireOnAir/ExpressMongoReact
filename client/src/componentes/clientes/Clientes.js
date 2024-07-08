import React, { Fragment, useEffect, useState } from 'react';
import clienteAxios from '../../config/axios';

function Clientes() {
    const [clientes, guardarClientes] = useState([]);

    const consultarAPI = async () => {
        try {
            const clientesConsulta = await clienteAxios.get('/clientes');
            guardarClientes(clientesConsulta.data);
        } catch (error) {
            console.error("Error al consultar la API:", error);
        }
    };

    useEffect(() => {
        consultarAPI();
    }, []); // Solo se ejecuta una vez al montar el componente

    return (
        <Fragment>
            <h2>Clientes</h2>
            <ul className="listado-clientes">
                {clientes.map(cliente => (
                    <li key={cliente._id}>
                        {cliente.nombre} {cliente.apellido} - {cliente.empresa}
                    </li>
                ))}
            </ul>
        </Fragment>
    );
}

export default Clientes;
