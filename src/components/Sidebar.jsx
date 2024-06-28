import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/sierra.png";
import { v } from "../styles/Variables";
import {
  AiOutlineLeft,
  AiOutlineHome,
  AiOutlineApartment,
  AiOutlineSetting,
} from "react-icons/ai";
import { MdOutlineAnalytics, MdLogout, MdPerson } from "react-icons/md";
import { ThemeContext } from "../App";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Sidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const ModSidebaropen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubMenu = (index) => {
    setOpenIndexes((prevState) =>
      prevState.includes(index)
        ? prevState.filter((i) => i !== index)
        : [...prevState, index]
    );
  };

  const { setTheme, theme } = useContext(ThemeContext);

  const CambiarTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setLogoutDialogOpen(false);
  };

  const confirmLogout = () => {
    handleLogout();
    setLogoutDialogOpen(false);
  };

  const getIcon = (label) => {
    switch (label) {
      case "Usuario":
        return <MdPerson />;
      case "Articulos":
        return <AiOutlineApartment />;
      case "Proceso":
        return <AiOutlineSetting />;
      case "Ubicacion":
        return <AiOutlineHome />;
      case "Produccion":
        return <MdOutlineAnalytics />;
      case "Compra":
        return <MdOutlineAnalytics />;
      case "Salir":
        return <MdLogout />;
      case "Perfil":
        return <MdPerson />;
      default:
        return <AiOutlineHome />;
    }
  };

  return (
    <Container isopen={sidebarOpen ? 1 : 0} themeuse={theme}>
      <button className="Sidebarbutton" onClick={ModSidebaropen}>
        <AiOutlineLeft />
      </button>
      <div className="Logocontent">
        <div className="imgcontent">
          <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }}/>
          <h2 style={{ display: sidebarOpen ? 'block' : 'none' }}>MRP</h2>
        </div>
      </div>
      {linksArray.map(({ label, to, subMenu }, index) => (
        <div key={label}>
          <div className="LinkContainer" onClick={() => toggleSubMenu(index)}>
            <NavLink
              to={to}
              className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
            >
              <div className="Linkicon">{getIcon(label)}</div>
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          </div>
          {subMenu && openIndexes.includes(index) && (
            <div className="SubMenu">
              {subMenu.map((subLink, subIndex) => (
                <NavLink
                  key={subIndex}
                  to={subLink.to}
                  className={({ isActive }) =>
                    `SubLinks${isActive ? ` active` : ``}`
                  }
                >
                  <span>{subLink.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
      <Divider />
      {secondarylinksArray.map(({ label, to, icon }) => (
        <div className="LinkContainer" key={label}>
          {label === "Salir" ? (
            <>
              <Button className="Links logout" onClick={handleLogoutClick}>
                {sidebarOpen && <div className="Linkicon"><MdLogout /></div>}
                {sidebarOpen && <span>Salir</span>}
              </Button>
              <Dialog
                open={logoutDialogOpen}
                onClose={handleCloseDialog}
              >
                <DialogTitle>Confirmación</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    ¿Estás seguro de que quieres cerrar sesión?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    Cancelar
                  </Button>
                  <Button onClick={confirmLogout} color="primary">
                    Cerrar sesión
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <NavLink
              to={to}
              className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
            >
              <div className="Linkicon">{getIcon(label)}</div>
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          )}
        </div>
      ))}
      <Divider />
      <div className="Themecontent">
        {sidebarOpen && <span className="titletheme">Dark mode</span>}
        <div className="Togglecontent">
          <label className="switch">
            <input
              type="checkbox"
              onChange={CambiarTheme}
              checked={theme === "dark"}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </Container>
  );
};

const linksArray = [
  {
    label: "Usuario",
    subMenu: [
      {
        label: "Rol",
        to: "/rol",
      },
      {
        label: "Usuarios",
        to: "/usuario",
      },
    ],
  },
  {
    label: "Articulos",
    subMenu: [
      {
        label: "Producto",
        to: "/producto",
      },
      {
        label: "Materia Prima",
        to: "/materia-prima",
      },
    ],
  },
  {
    label: "Proceso",
    subMenu: [
      {
        label: "Procesos",
        to: "/proceso",
      },
      {
        label: "Lista de Procesos",
        to: "/lista-proceso",
      },
    ],
  },
  {
    label: "Ubicacion",
    subMenu: [
      {
        label: "Tipo Ubicacion",
        to: "/tipo-ubicacion",
      },
      {
        label: "Ubicacion",
        to: "/ubicacion",
      },
      {
        label: "Estante",
        to: "/estante",
      },
      {
        label: "Ubicacion Articulo",
        to: "/ubicacion-articulo",
      },
    ],
  },
  {
    label: "Produccion",
    subMenu: [
      {
        label: "Orden de Produccion",
        to: "/orden-produccion",
      },
    ],
  },
  {
    label: "Compra",
    subMenu: [
      {
        label: "Proveedor",
        to: "/proveedor",
      },
      {
        label: "Orden de Compra",
        to: "/orden-compra",
      },
    ],
  },
  {
    label: "Reportes",
    subMenu: [
      {
        label: "Reporte Ejecutivo",
        to: "/ejecutivo",
      },
    ],
  },
];

const secondarylinksArray = [
  {
    label: "Perfil",
    icon: <MdPerson />,
    to: "/perfil",
  },
  {
    label: "Salir",
    icon: <MdLogout />,
    to: "/",
  },
];

const Container = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ isopen }) => (isopen ? "250px" : "60px")};
  transition: width 0.3s;
  padding-top: 20px;
  z-index: 10;

  @media (max-width: 768px) {
    width: ${({ isopen }) => (isopen ? "200px" : "50px")};
  }

  .Sidebarbutton {
    position: absolute;
    top: ${v.xxlSpacing};
    right: -18px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 4px ${(props) => props.theme.bg3},
      0 0 7px ${(props) => props.theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ isopen }) => (isopen ? `initial` : `rotate(180deg)`)};
    border: none;
    letter-spacing: inherit;
    color: inherit;
    font-size: inherit;
    text-align: inherit;
    padding: 0;
    font-family: inherit;
    outline: none;
  }

  .Logocontent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: ${v.lgSpacing};
    .imgcontent {
      display: flex;
      img {
        max-width: 100%;
        height: auto;
      }
      cursor: pointer;
      transition: all 0.3s;
      transform:       ${({ isopen }) => (isopen ? `scale(0.7)` : `scale(0.5)`)};
    }
    h2 {
      display: ${({ isopen }) => (isopen ? `block` : `none`)};
    }
  }

  .LinkContainer {
    margin: 8px 0;
    padding: 0 15%;
    :hover {
      background: ${(props) => props.theme.bg3};
    }
    .Links {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: calc(${v.smSpacing} - 2px) 0;
      color: ${(props) => props.theme.text};
      height: 50px;
      .Linkicon {
        padding: ${v.smSpacing} ${v.mdSpacing};
        display: flex;
        svg {
          font-size: 25px;
        }
      }
      span {
        display: ${({ isopen }) => (isopen ? "inline" : "none")};
      }
      &.active {
        .Linkicon {
          svg {
            color: ${(props) => props.theme.bg4};
          }
        }
      }
    }

    .logout {
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      padding: 0;
      margin: 8px 0;
      cursor: pointer;
      .Linkicon {
        padding: ${v.smSpacing} ${v.mdSpacing};
        display: flex;
        svg {
          font-size: 25px;
        }
      }
      span {
        display: ${({ isopen }) => (isopen ? "inline" : "none")};
      }
      :hover {
        background: ${(props) => props.theme.bg3};
      }
    }
  }

  .SubMenu {
    padding-left: ${({ isopen }) => (isopen ? "90px" : "0")};
       .SubLinks {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: calc(${v.smSpacing} - 2px) 0;
      color: ${(props) => props.theme.text};
      height: 40px;
      &.active {
        color: ${(props) => props.theme.bg4};
      }
      span {
        display: ${({ isopen }) => (isopen ? "inline" : "none")};
      }
    }
  }

  .Themecontent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .titletheme {
      display: block;
      padding: 10px;
      font-weight: 700;
      opacity: ${({ isopen }) => (isopen ? `1` : `0`)};
      transition: all 0.3s;
      white-space: nowrap;
      overflow: hidden;
    }
    .Togglecontent {
      margin: ${({ isopen }) => (isopen ? `auto 40px` : `auto 15px`)};
      width: 36px;
      height: 20px;
      border-radius: 10px;
      transition: all 0.3s;
      position: relative;
      .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
          &:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
          }
        }
        input:checked + .slider {
          background-color: #2196f3;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
      }
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.bg3};
  margin: ${v.lgSpacing} 0;
`;

export default Sidebar;

