import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/sierra.png";
import { AiOutlineLeft, AiOutlineHome, AiOutlineApartment, AiOutlineSetting } from "react-icons/ai";
import { MdOutlineAnalytics, MdLogout } from "react-icons/md";
import { ThemeContext } from "../App";

const linksArray = [
  {
    label: "Articulos",
    to: "/",
    subMenu: [
      { label: "Producto", to: "/producto" },
      { label: "Materia Prima", to: "/materia-prima" },
    ],
  },
  {
    label: "Ubicacion",
    to: "/",
    subMenu: [
      { label: "Ubicacion", to: "/ubicacion" },
      { label: "Estante", to: "/estante" },
      { label: "Ubicacion Articulo", to: "/ubicacion-articulo" },
    ],
  },
  {
    label: "Proceso",
    to: "/Proceso",
  },
  {
    label: "Usuario",
    to: "/",
    subMenu: [
      { label: "Rol", to: "/rol" },
      { label: "Estante", to: "/estante" },
      { label: "Ubicacion Articulo", to: "/ubicacion-articulo" },
    ],
  },
  {
    label: "Ordenes",
    to: "/productos",
  },
  {
    label: "Reportes",
    to: "/diagramas",
  },
  {
    label: "Configuración",
    to: "/null",
    icon: <AiOutlineSetting />,
  },
  {
    label: "Salir",
    to: "/null",
    icon: <MdLogout />,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, handleLogout }) => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleSubMenu = (index) => {
    setOpenIndexes((prevState) =>
      prevState.includes(index) ? prevState.filter((i) => i !== index) : [...prevState, index]
    );
  };

  const ModSidebaropen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Container isOpen={sidebarOpen} themeUse={theme}>
      <button className="Sidebarbutton" onClick={ModSidebaropen}>
        <AiOutlineLeft />
      </button>
      <div className="Logocontent">
        <div className="imgcontent">
          <img src={logo} alt="Logo" style={{ width: '50px', height: 'auto' }}/>
        </div>
        <h2>MRP</h2>
      </div>
      {linksArray.map(({ label, to, subMenu, icon }, index) => (
        <div key={label}>
          <div className="LinkContainer" onClick={() => toggleSubMenu(index)}>
            {subMenu ? (
              <div>
                <NavLink to={to} className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>
                  <div className="Linkicon">{icon || <AiOutlineHome />}</div>
                  {sidebarOpen && <span>{label}</span>}
                </NavLink>
                {subMenu && openIndexes.includes(index) && (
                  <div className="SubMenu">
                    {subMenu.map(({ label, to }) => (
                      <NavLink key={label} to={to} className={({ isActive }) => `SubLinks${isActive ? ` active` : ``}`}>
                        <span>{label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink to={to} className={({ isActive }) => `Links${isActive ? ` active` : ``}`}>
                <div className="Linkicon">{icon || <AiOutlineHome />}</div>
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            )}
          </div>
        </div>
      ))}
      <Divider />
      <div className="Themecontent">
        {sidebarOpen && <span className="titletheme">Dark mode</span>}
        <div className="Togglecontent">
          <label className="switch">
            <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? "250px" : "60px")};
  transition: width 0.3s;
  padding-top: 20px;
  z-index: 10;

  @media (max-width: 768px) {
    width: ${({ isOpen }) => (isOpen ? "200px" : "50px")};
  }

  .Sidebarbutton {
    position: absolute;
    top: 20px;
    right: -18px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 4px ${(props) => props.theme.bg3}, 0 0 7px ${(props) => props.theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ isOpen }) => (isOpen ? `initial` : `rotate(180deg)`)};
    border: none;
    outline: none;
  }

  .Logocontent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;

    .imgcontent {
      display: flex;
      img {
        max-width: 100%;
        height: auto;
      }
    }

    h2 {
      display: ${({ isOpen }) => (isOpen ? `block` : `none`)};
    }
  }

  .LinkContainer {
    margin: 8px 0;
    padding: 0 15%;
    cursor: pointer;

    :hover {
      background: ${(props) => props.theme.bg3};
    }

    .Links {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 10px 0;
      height: 50px;

      .Linkicon {
        padding: 10px;
        display: flex;

        svg {
          font-size: 25px;
        }
      }

      span {
        display: ${({ isOpen }) => (isOpen ? "inline" : "none")};
      }

      &.active .Linkicon svg {
        color: ${(props) => props.theme.bg4};
      }
    }

    .SubMenu {
      padding-left: 90px;

      .SubLinks {
        display: flex;
        align-items: center;
        text-decoration: none;
        padding: 10px 0;
        height: 40px;

        span {
          display: ${({ isOpen }) => (isOpen ? "inline" : "none")};
        }

        &.active {
          color: ${(props) => props.theme.bg4};
        }
      }
    }
  }

  .Themecontent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 15%;

    .titletheme {
      display: block;
      font-weight: 700;
      opacity: ${({ isOpen }) => (isOpen ? `1` : `0`)};
      transition: all 0.3s;
    }

    .Togglecontent {
      margin: 0 auto;
      width: 36px;
      height: 20px;
      border-radius: 10px;
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
