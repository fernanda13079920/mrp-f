import React, { useState, createContext } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Light, Dark } from "./styles/Themes";
import MyRoutes from "./routers/Routes"; 
import { AuthProvider } from './context/authContext';
import Login from "./Pages/Login";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      if (!authData) {
        throw new Error('No auth data found');
      }

      const response = await axios.post('http://127.0.0.1:8000/api/logout', {
        id: authData.id,
        rol_id: authData.rol_id,
        persona_id: authData.persona_id,
        username: authData.username,
      });

      const { success, message, data } = response.data;

      if (success) {
        localStorage.removeItem('authData');
        setAuthenticated(false);
        navigate('/login');
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
    <ThemeContext.Provider value={{ setTheme, theme, authenticated: isAuthenticated }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          <AuthProvider>
            {isAuthenticated ? (
              <Container className={sidebarOpen ? "sidebarState active" : ""}>
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  handleLogout={handleLogout} // Pasar handleLogout como prop
                />
                <MainContent>
                  <MyRoutes />
                </MainContent>
              </Container>
            ) : (
              <Login setAuthenticated={setAuthenticated} />
            )}
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  background: ${({ theme }) => theme.bgtotal};
  transition: all 0.3s;
  &.active {
    grid-template-columns: 300px auto;
  }
  color: ${({ theme }) => theme.text};
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export default App;
