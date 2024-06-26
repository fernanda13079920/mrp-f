import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const Profile = () => {
  const { authData } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/usuario/${authData.id}`);
        const { success, data, message } = response.data;

        if (success && data && data.length > 0) {
          setUserData(data[0]);
        } else {
          throw new Error(message || 'No se encontraron datos de usuario.');
        }
      } catch (error) {
        setError(error.message || 'Error al obtener los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    if (authData) {
      fetchUserData();
    }

  }, [authData]);

  if (loading) {
    return <div className="container mt-4">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="container mt-4 text-danger">{error}</div>;
  }

  if (!userData) {
    return <div className="container mt-4 text-danger">No se encontraron datos de usuario.</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h1 className="text-primary mb-4">Perfil de Usuario</h1>
        <div className="row">
          
          <div className="col-md-9">
            <p><strong>Nombre:</strong> {userData.persona.nombre} {userData.persona.apellido_p} {userData.persona.apellido_m}</p>
            <p><strong>Correo:</strong> {userData.persona.correo}</p>
            <p><strong>Fecha de Nacimiento:</strong> {userData.persona.nacimiento}</p>
            <p><strong>Celular:</strong> {userData.persona.celular}</p>
            <p><strong>Rol:</strong> {userData.rol.nombre}</p>
            <p><strong>Función:</strong> {userData.rol.funcion}</p>
            <p><strong>Responsabilidad:</strong> {userData.rol.responsabilidad}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
