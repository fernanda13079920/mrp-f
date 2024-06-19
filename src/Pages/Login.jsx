import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Panel } from 'primereact/panel';
import { AuthContext } from '../context/authContext';
import { ThemeContext } from '../App';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);
  const { saveAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        username,
        password,
      });
      const { success, message, data } = response.data;
      if (success) {
        saveAuthData(data);
        setAuthenticated(true);
        navigate('/roles');
      } else {
        setError(message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid" style={{ background: theme.bgtotal, minHeight: '100vh' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-4">
          <Panel header="Inicio de sesión" className="panel shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Inicio de sesión</h2>
              <form onSubmit={handleLogin}>
                <div className="d-flex flex-column align-items-center">
                  <FloatLabel className="w-100 mb-3">
                    <InputText
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                      className="w-100"
                    />
                    <label htmlFor="username">Usuario</label>
                  </FloatLabel>

                  <div className="mt-2 mb-2 w-100"></div>

                  <FloatLabel className="w-100 mb-3">
                    <InputText
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-100"
                    />
                    <label htmlFor="password">Contraseña</label>
                  </FloatLabel>

                  {error && <p className="text-danger mt-3">{error}</p>}

                  <div className="d-flex justify-content-center mt-3">
                    <Button
                      label={loading ? "Iniciando sesión..." : "Iniciar sesión"}
                      type="submit"
                      className="p-button-success"
                      disabled={loading}
                    />
                  </div>
                </div>
              </form>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default Login;
