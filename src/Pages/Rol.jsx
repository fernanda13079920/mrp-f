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
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../context/authContext';

const PERMISOS = {
    CREATE: 2,
    EDIT: 3,
    DELETE: 4
};

const Roles = () => {
    const { authData } = useContext(AuthContext);
    const [roles, setRoles] = useState([]);
    const [rol, setRol] = useState({ id: null, nombre: '', funcion: '', responsabilidad: '', permisos: [] });
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [verDialog, setVerDialog] = useState(false);
    const [permisos, setPermisos] = useState([]);

    useEffect(() => {
        fetchRoles();
        fetchPermisos();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/rol");
            setRoles(response.data.data);
            console.log('Roles fetched:', response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchPermisos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/permiso");
            setPermisos(response.data.data.map(p => ({ label: p.nombre, value: p.id })));
            console.log('Permisos fetched:', response.data.data);
        } catch (error) {
            console.error("Error fetching permisos:", error);
        }
    };

    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedRol = { ...rol, [name]: val };
        setRol(updatedRol);
    };

    const onPermisoChange = (e) => {
        const selectedPermisoIds = e.value;
        setRol(prevRol => ({ ...prevRol, permisos: selectedPermisoIds }));
    };

    const openNew = () => {
        setRol({ id: null, nombre: '', funcion: '', responsabilidad: '.', permisos: [] });
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    const saveRol = async () => {
        setSubmitted(true);

        if (rol.nombre && rol.funcion && rol.responsabilidad && rol.permisos.length) {
            try {
                const payload = {
                    ...rol,
                    permisos: rol.permisos // Asegúrate de que los permisos se envían correctamente
                };

                if (rol.id) {
                    await axios.put(`http://3.147.242.40/api/rol/${rol.id}`, payload);
                } else {
                    await axios.post(`http://3.147.242.40/api/rol`, payload);
                }

                setProductDialog(false);
                fetchRoles(); // Actualiza la lista de roles después de guardar
                setRol({ id: null, nombre: '', funcion: '', responsabilidad: '.', permisos: [] });
            } catch (error) {
                console.log("Error saving rol:", error);
            }
        }
    };

    const editRol = (rol) => {
        setRol({
            ...rol,
            permisos: rol.permisos.map(p => p.id) // Ajusta los permisos para que sean compatibles con el MultiSelect
        });
        setProductDialog(true);
    };

    const confirmDeleteRol = (rol) => {
        setRol(rol);
        setDeleteProductsDialog(true);
    };

    const deleteRol = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/rol/${rol.id}`);
            fetchRoles();
            setDeleteProductsDialog(false);
            setRol({ id: null, nombre: '', funcion: '', responsabilidad: '', permisos: [] });
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
    const [filtroGlobal, setFiltroGlobal] = useState('');

    const onFiltroGlobalChange = (e) => {
        setFiltroGlobal(e.target.value);
    };

    const filterGlobal = (roles) => {
        return roles.filter(rol =>
            rol.nombre.toLowerCase().includes(filtroGlobal.toLowerCase()) ||
            rol.funcion.toLowerCase().includes(filtroGlobal.toLowerCase())
        );
    };
    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Roles</h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nuevo Rol" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}
                <div className="p-field">
                    <label htmlFor="filtroGlobal" className="font-weight-bold">Buscar</label>
                    <InputText id="filtroGlobal" value={filtroGlobal} onChange={onFiltroGlobalChange} className="form-control mb-4" />
                </div>
                <DataTable value={filterGlobal(roles)} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="funcion" header="Función" sortable></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button className="p-button-rounded p-button-outlined p-button-success p-button-sm p-m-2" onClick={() => verPermisos(rowData)} label="Permisos" />
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-m-2" onClick={() => editRol(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteRol(rowData)} />
                            )}
                        </div>
                    )} style={{ textAlign: 'center', width: '12em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '40rem', overflowY: 'auto', paddingBottom: '0' }} header={`${rol && rol.id ? 'Editar' : 'Nuevo'} Rol`} modal className="p-fluid" onHide={hideDialog}>
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
                        <label htmlFor="permisos" className="font-weight-bold">Permisos</label>
                        <MultiSelect
                            id="permisos"
                            value={rol?.permisos || []}
                            options={permisos}
                            onChange={onPermisoChange}
                            optionLabel="label"
                            placeholder="Seleccione permisos"
                            className="form-control"
                            display="chip"
                        />
                        {submitted && (!rol?.permisos || rol.permisos.length === 0) && (
                            <small className="p-error">Debe seleccionar al menos un permiso.</small>
                        )}
                    </div>
                    <div className="p-d-flex p-jc-end mt-5">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger p-ml-2" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button-success p-ml-2" onClick={saveRol} />
                    </div>
                </Dialog>
                <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {rol && <span>¿Estás seguro de que deseas eliminar <b>{rol.nombre}</b>?</span>}
                    </div>
                </Dialog>
                <Dialog visible={verDialog} style={{ width: '40rem', overflowY: 'auto', paddingBottom: '0' }} header={`Permisos de ${rol.nombre}`} modal className="p-fluid" onHide={() => setVerDialog(false)}>
                    <h4>Permisos asignados:</h4>
                    <ul>
                        {rol.permisos.map((permiso, index) => (
                            <li key={index}>{permiso.nombre}</li>
                        ))}
                    </ul>
                </Dialog>
            </div>
        </div>
    );
};

export default Roles;
