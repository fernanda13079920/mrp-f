import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import styled from 'styled-components';
import { MdLogout } from "react-icons/md";
import { AuthContext } from '../context/authContext';

const PERMISOS = {
    VIEW: 1,
    CREATE: 2,
    EDIT: 3,
    DELETE: 4
};

const Roles = () => {
    const { authData } = useContext(AuthContext);
    const [roles, setRoles] = useState([]);
    const [rol, setRol] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [verDialog, setVerDialog] = useState(false);
    const [permisos, setPermisos] = useState([]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/rol");
            setRoles(response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchPermisos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/permiso");
            setPermisos(response.data.data);
        } catch (error) {
            console.error("Error fetching permisos:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchPermisos();
    }, []);

    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedRol = { ...rol, [name]: val };
        setRol(updatedRol);
    };

    const onPermisoChange = (e) => {
        const selectedPermisoIds = e.value;
        const selectedPermisos = permisos.filter(p => selectedPermisoIds.includes(p.id));
        setRol(prevRol => ({ ...prevRol, permisos: selectedPermisos }));
    };

    const openNew = () => {
        setRol({ id: null, nombre: '', funcion: '', responsabilidad: '', permisos: [] });
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    const saveRol = async () => {
        setSubmitted(true);

        if (rol.nombre && rol.funcion && rol.responsabilidad) {
            try {
                if (rol.id) {
                    await axios.put(`http://127.0.0.1:8000/api/rol/${rol.id}`, rol);
                } else {
                    await axios.post(`http://127.0.0.1:8000/api/rol`, rol);
                }
                setProductDialog(false);
                setRol(null);
                fetchRoles();
            } catch (error) {
                console.log("Error saving rol:", error);
            }
        }
    };

    const editRol = (rol) => {
        setRol(rol);
        setProductDialog(true);
    };

    const confirmDeleteRol = (rol) => {
        setRol(rol);
        setDeleteProductsDialog(true);
    };

    const deleteRol = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/rol/${rol.id}`);
            fetchRoles();
            setDeleteProductsDialog(false);
            setRol(null);
        } catch (error) {
            console.log("Error deleting rol:", error);
        }
    };

    const verPermisos = (rol) => {
        setRol(rol);
        setVerDialog(true);
    };

    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteRol} />
        </React.Fragment>
    );

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Roles</h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nuevo Rol" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}

                <DataTable value={roles} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="funcion" header="Función"></Column>
                    <Column field="responsabilidad" header="Responsabilidad"></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            {authData.permisos.includes(PERMISOS.VIEW) && (
                                <Button className="p-button-rounded p-button-outlined p-button-success p-button-sm p-mr-2" onClick={() => verPermisos(rowData)} label="Permisos" />
                            )}
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editRol(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteRol(rowData)} />
                            )}
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

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

                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveRol} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                        <div className="p-d-flex p-ai-center p-p-3">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                            {rol && (
                                <span>¿Seguro que quieres eliminar el rol <b>{rol.nombre}</b>?</span>
                            )}
                        </div>
                    </Dialog>

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
`;

export default Roles;
