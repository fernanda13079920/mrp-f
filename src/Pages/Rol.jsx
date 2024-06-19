import React, { useState, useEffect , useContext} from "react";

import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos base de PrimeReact
import 'primeflex/primeflex.css'; // Estilos de PrimeFlex para alineación y disposición

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
import { MdOutlineAnalytics, MdLogout } from "react-icons/md";
import { ThemeContext } from "../App";


const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [rol, setRol] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [verDialog, setVerDialog] = useState(false);
    const [permisos, setPermisos] = useState([]); // Estado para almacenar todos los permisos disponibles

    // Función para obtener la lista de roles desde el backend
    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/rol");
            setRoles(response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Función para obtener la lista de permisos desde el backend
    const fetchPermisos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/permiso");
            setPermisos(response.data.data);
        } catch (error) {
            console.error("Error fetching permisos:", error);
        }
    };
    const { setTheme, theme } = useContext(ThemeContext);
    const CambiarTheme = () => {
      setTheme((theme) => (theme === "light" ? "dark" : "light"));
    };
    // Cargar la lista de roles y permisos al cargar el componente
    useEffect(() => {
        fetchRoles();
        fetchPermisos();
    }, []);

    // Función para manejar cambios en los campos del formulario
    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedRol = { ...rol, [name]: val };
        setRol(updatedRol);
    };

    // Función para manejar cambios en la selección de permisos
    const onPermisoChange = (e) => {
        const selectedPermisoIds = e.value; // Array de IDs de permisos seleccionados
        const selectedPermisos = permisos.filter(p => selectedPermisoIds.includes(p.id)); // Filtrar permisos seleccionados
        setRol(prevRol => ({ ...prevRol, permisos: selectedPermisos })); // Actualizar estado de rol con permisos seleccionados
    };

    // Función para abrir el diálogo de nuevo/editar rol
    const openNew = () => {
        setRol({ id: null, nombre: '', funcion: '', responsabilidad: '', permisos: [] });
        setProductDialog(true);
    };

    // Función para cerrar el diálogo de nuevo/editar rol
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    // Función para guardar un nuevo rol o actualizar uno existente
    const saveRol = async () => {
        setSubmitted(true);

        // Validar que se haya ingresado nombre, función y responsabilidad
        if (rol.nombre && rol.funcion && rol.responsabilidad) {
            try {
                if (rol.id) {
                    // Si el rol tiene un ID, actualizar en el backend
                    await axios.put(`http://127.0.0.1:8000/api/rol/${rol.id}`, rol);
                } else {
                    // Si no tiene ID, crear un nuevo rol en el backend
                    await axios.post(`http://127.0.0.1:8000/api/rol`, rol);
                }
                setProductDialog(false);
                setRol(null); // Limpiar estado de rol
                fetchRoles(); // Recargar la lista de roles
            } catch (error) {
                console.log("Error saving rol:", error);
            }
        }
    };

    // Función para abrir el diálogo de editar rol
    const editRol = (rol) => {
        setRol(rol);
        setProductDialog(true);
    };

    // Función para abrir el diálogo de confirmar eliminación de rol
    const confirmDeleteRol = (rol) => {
        setRol(rol);
        setDeleteProductsDialog(true);
    };

    // Función para eliminar un rol
    const deleteRol = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/rol/${rol.id}`);
            fetchRoles(); // Recargar la lista de roles
            setDeleteProductsDialog(false); // Cerrar diálogo de confirmación de eliminación
            setRol(null); // Limpiar estado de rol
        } catch (error) {
            console.log("Error deleting rol:", error);
        }
    };

    // Función para abrir el diálogo de ver permisos de un rol
    const verPermisos = (rol) => {
        setRol(rol);
        setVerDialog(true);
    };

    // Pie de página del diálogo de confirmación de eliminación
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteRol} />
        </React.Fragment>
    );

    // Renderizar el componente
    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Roles</h1>
                <Button label="Nuevo Rol" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />

                <DataTable value={roles} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="funcion" header="Función"></Column>
                    <Column field="responsabilidad" header="Responsabilidad"></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button className="p-button-rounded p-button-outlined p-button-success p-button-sm p-mr-2" onClick={() => verPermisos(rowData)} label="Permisos" />
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editRol(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteRol(rowData)} />
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

                {/* Diálogo de nuevo/editar rol */}
                <Dialog visible={productDialog} style={{ width: '40rem', overflowY: 'auto', paddingBottom: '0' }} header={`${rol ? 'Editar' : 'Nuevo'} Rol`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <InputText id="nombre" value={rol?.nombre || ''} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className="form-control" />
                        {submitted && !rol?.nombre && <small className="p-error">El nombre es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="funcion" className="font-weight-bold">Función</label>
                        <InputText id="funcion" value={rol?.funcion || ''} onChange={(e) => onInputChange(e, 'funcion')} required autoFocus className="form-control" />
                        {submitted && !rol?.funcion && <small className="p-error">La función es requerida.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="responsabilidad" className="font-weight-bold">Responsabilidad</label>
                        <InputText id="responsabilidad" value={rol?.responsabilidad || ''} onChange={(e) => onInputChange(e, 'responsabilidad')} required autoFocus className="form-control" />
                        {submitted && !rol?.responsabilidad && <small className="p-error">La responsabilidad es requerida.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="permisos" className="font-weight-bold">Permisos</label>
                        console.log("Permisos:", permisos);
                        <MultiSelect
                            id="permisos"
                            value={rol?.permisos.map(p => p.id) || []}
                            options={permisos.map(p => ({ label: p.nombre, value: p.id }))}
                            onChange={onPermisoChange}
                            optionLabel="nombre"
                            placeholder="Seleccione permisos"
                            className="form-control"
                            display="chip"
                        />
                        {submitted && (!rol?.permisos || rol.permisos.length === 0) && (
                            <small className="p-error">Debe seleccionar al menos un permiso.</small>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveRol} />
                    </div>
                </Dialog>

                {/* Diálogo de confirmación para eliminar rol */}
                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {rol && (
                            <span>¿Seguro que quieres eliminar el rol <b>{rol.nombre}</b>?</span>
                        )}
                    </div>
                </Dialog>

                {/* Diálogo para ver permisos de un rol */}
                <Dialog visible={verDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`Permisos de Rol - ${rol?.nombre}`} modal className="p-fluid" onHide={() => setVerDialog(false)} closable={true}>
                    <div className="p-field">
                        <label className="font-weight-bold">Permisos</label>
                        <DataTable value={rol?.permisos} className="p-datatable-sm">
                            <Column field="nombre" header="Nombre"></Column>
                        </DataTable>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

const secondarylinksArray = [
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
      
    }
  `;
  
export default Roles;

                           
