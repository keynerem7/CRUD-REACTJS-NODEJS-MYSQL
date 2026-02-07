import { useState, useEffect } from 'react';
import './App.css';

function App() {
  //estados para guardar lo que el usuario escriba
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState(0);

  //lista que contiene todos los empleados registrados
  const [registros, setRegistros] = useState([]);

  //estado que se usa para saber si estamos registrando o editando
  const [editIndex, setEditIndex] = useState(null);

  //cuando se carga la pagina obtenemos los empleados del backend\
  useEffect(() => {
    //definimos la funcion asincronas para cargar empleados
    const cargarEmpleados = async () => {
      try {
        const response = await fetch('http://localhost:3001/empleados');
        const data = await response.json();
        setRegistros(data);
      } catch (error) {
        alert('Error al cargar los empleados');
      }
    };
    cargarEmpleados();
  }, []);

  //esta funcion se ejecuta al presionar el boton registrar o actualizar

  const registrarDatos = async (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      try {
        const empleado = registros[editIndex]; //obtener el empleado actual
        //enviar una peticion PUT
        const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, edad, pais, cargo, anios })
        });

        if (response.ok) {
          const nuevosRegistros = [...registros];

          nuevosRegistros[editIndex] = { ...empleado, nombre, edad, pais, cargo, anios };
          setRegistros(nuevosRegistros);
          setEditIndex(null);
          alert('Empleado actualizado correctamente');

        } else {
          alert('error al actualizar el empleado');
        }


      } catch (error) {
        alert('error de conexion al actualizar');
      }
    } else {
      //si no estoy editando es porque voy a registrar
      try {
        const response = await fetch('http://localhost:3001/empleados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, edad, pais, cargo, anios })
        });

        const data = await response.json();
        if (response.ok) {
          setRegistros([...registros, data]);
          alert('Empleado guardado correctamente');
        } else {
          alert('Error al guardar el empleado');
        }
      } catch (error) {
        alert('Error de conexion');
      }
    }

    setNombre("");
    setEdad(0);
    setPais("");
    setCargo("");
    setAnios(0);
  };

  //funcion para eliminar el registro

  const eliminarRegistro = async (idx) => {
    const empleado = registros[idx];

    try {
      const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        //si el backend elimina correctamente , actualizamos filtrando el indice
        setRegistros(registros.filter((_, i) => i !== idx));

        if (editIndex === idx) {
          setEditIndex(null);
          setNombre("");
          setEdad(0);
          setPais("");
          setCargo("");
          setAnios(0);
        }
        alert('Empleado eliminado correctamente');
      } else {
        alert('Error al eliminar el empleado');
      }
    } catch (error) {
      alert('Error de conexion al eliminar');
    }
  };


  const editarRegistro = (idx) => {

    const reg = registros[idx];//obtenemos el empleado por el indice

    setNombre(reg.nombre);
    setEdad(reg.edad);
    setPais(reg.pais);
    setCargo(reg.cargo);
    setAnios(reg.anios ?? 0);
    setEditIndex(idx);
  };

  return (
    <div className="App">

    {/* Card formulario */}
    <div className="card">
      <h2>{editIndex !== null ? 'Editar empleado' : 'Registrar empleado'}</h2>

      <form className="datos" onSubmit={registrarDatos}>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>

        <label>
          Edad:
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(Number(e.target.value))}
          />
        </label>

        <label>
          País:
          <input
            type="text"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          />
        </label>

        <label>
          Cargo:
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
        </label>

        <label>
          Años:
          <input
            type="number"
            value={anios}
            onChange={(e) => setAnios(Number(e.target.value))}
          />
        </label>

        <button type="submit">
          {editIndex !== null ? 'Actualizar' : 'Registrar'}
        </button>
      </form>
    </div>

    {/* Card tabla */}
    <div className="card">
      <h2>Lista de empleados</h2>

      {registros.length > 0 ? (
        <div className="tabla-container">
          <table className="tabla-registros">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Edad</th>
                <th>País</th>
                <th>Cargo</th>
                <th>Años</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((reg, idx) => (
                <tr key={idx}>
                  <td>{reg.nombre}</td>
                  <td>{reg.edad}</td>
                  <td>{reg.pais}</td>
                  <td>{reg.cargo}</td>
                  <td>{reg.anios}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => editarRegistro(idx)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarRegistro(idx)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: '#9ca3af' }}>
          No hay empleados registrados.
        </p>
      )}
    </div>

  </div>
  );
}

export default App; // Exportamos el componente para poder usarlo en otros archivos
