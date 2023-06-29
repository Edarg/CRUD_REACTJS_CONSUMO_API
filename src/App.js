import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import axios from "axios";

function App() {
  //Varaibles
  //---------------------------------------------------------------------
  //se establece la dirección de la API para los demas tipos de petición
  const url = "http://localhost/udemy/index.php";
  const [data, setData] = useState([]);
  const [ModalInsertar, setModalInsertar] = useState(false);
  const [ModalEditar, setModalEditar] = useState(false);
  const [ModalEliminar, setModalEliminar] = useState(false);

  //estado para almacenar lo que se escribe en los Modales
  //-------------------------------------------------------------------
  const [framworkselecionado, setFrameworkSeleccionado] = useState({
    id: "",
    nombre: "",
    lanzamiento: "",
    desarrollador: "",
  });

  //metodo para capturar datos del Modal Insertar y colocarlo en framework seleccionado
  //----------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFrameworkSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(framworkselecionado);
  };

  //Metodos para invocar los Modal
  //-----------------------------------------------------------------------
  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!ModalInsertar);
  };
  const abrirCerrarModalEditar = () => {
    setModalEditar(!ModalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!ModalEliminar);
  };

  //Metodos para realizar peticiones a la API
  //---------------------------------------------------------------------
  //metodo para la peticiones GET
  const peticionGet = async () => {
    await axios.get(url).then((Response) => {
      setData(Response.data);
    }).catch(error =>{
      console.log(error);
    })
  };

  //metodo para la peticion POST
  const peticionPost = async () => {
    var f = new FormData();
    f.append("nombre", framworkselecionado.nombre);
    f.append("lanzamiento", framworkselecionado.lanzamiento);
    f.append("desarrollador", framworkselecionado.desarrollador);
    f.append("METHOD", "POST");

    await axios.post(url, f).then((Response) => {
      setData(data.concat(Response.data));
      abrirCerrarModalInsertar();
    }).catch(error =>{
      console.log(error);
    })
  };

  //metodo para la peticion PUT
  const peticionPut = async () => {
    var f = new FormData();
    f.append("nombre", framworkselecionado.nombre);
    f.append("lanzamiento", framworkselecionado.lanzamiento);
    f.append("desarrollador", framworkselecionado.desarrollador);
    f.append("METHOD", "PUT");

    await axios
      .post(url, f, { params: { id: framworkselecionado.id } })
      .then((Response) => {
        var dataNueva = data;
        dataNueva.map((framework) => {
          if (framework.id === framworkselecionado.id) {
            framework.nombre = framworkselecionado.nombre;
            framework.lanzamiento = framworkselecionado.lanzamiento;
            framework.desarrollador = framworkselecionado.desarrollador;
          }
        });

        setData(dataNueva);
        abrirCerrarModalEditar();
      }).catch(error =>{
        console.log(error);
      })
  };

  //metodo para la peticion delete
  //metodo para la peticion POST
  const peticionDelete = async () => {
    var f = new FormData();
    f.append("METHOD", "DELETE");

    await axios
      .post(url, f, { params: { id: framworkselecionado.id } })
      .then((Response) => {
        setData(
          data.filter((framework) => framework.id !== framworkselecionado.id)
        );
        abrirCerrarModalEliminar();
      }).catch(error =>{
        console.log(error);
      })
  };

  //metodo para asignar en los imput los valores de la fila seleccionada
  //--------------------------------------------------------------------
  const selecionarframework = (framework, caso) => {
    setFrameworkSeleccionado(framework);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  //----------------------------------------------------------------------
  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div className="App">
      <br />
      <button
        className="btn btn-success"
        onClick={() => abrirCerrarModalInsertar()}
      >
        Insertar
      </button>
      <br />
      <br />

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Funciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((framework) => (
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.nombre}</td>
              <td>{framework.lanzamiento}</td>
              <td>{framework.desarrollador}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => selecionarframework(framework, "Editar")}
                >
                  Editar
                </button>
                {"  "}
                <button
                  className="btn btn-danger"
                  onClick={() => selecionarframework(framework, "Eliminar")}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*Vista Modal para Insertar Datos*/}
      <Modal isOpen={ModalInsertar}>
        <ModalHeader>Insertar Frameworks</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
            />
            <br />
            <label>Lanzamiento</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="lanzamiento"
              onChange={handleChange}
            />
            <br />
            <label>Desarrollador</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="desarrollador"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>
            Insertar
          </button>
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/*Vista Modal para actualizar Datos*/}
      <Modal isOpen={ModalEditar}>
        <ModalHeader>Editar Frameworks</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
              value={framworkselecionado && framworkselecionado.nombre}
            />
            <br />
            <label>Lanzamiento</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="lanzamiento"
              onChange={handleChange}
              value={framworkselecionado && framworkselecionado.lanzamiento}
            />
            <br />
            <label>Desarrollador</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="desarrollador"
              onChange={handleChange}
              value={framworkselecionado && framworkselecionado.desarrollador}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()}>
            Editar
          </button>
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      {/*Vista Modal Confirmar eliminación de registro en la BD*/}
      <Modal isOpen={ModalEliminar}>
        <ModalBody>
          ¿Desea Eliminar {framworkselecionado && framworkselecionado.nombre}{" "}
          del registro?{" "}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=> peticionDelete()}>Sí</button>
          <button className="btn btn-success" onClick={() =>abrirCerrarModalEliminar()}>
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
