import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState({
        id: null,
        persona: {
            nombre: '',
            apellido_p: '',
            apellido_m: '',
            correo: '',
        },
        username: '',
        password: '',
        rol_id: 1,
        imagen: '',
    });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/usuario");
            setUsuarios(response.data.data);
        } catch (error) {
            console.error("Error fetching usuarios:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/rol");
            setRoles(response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleInputChange = (e, name) => {
        const { value } = e.target;
        setUsuario(prevUsuario => ({
            ...prevUsuario,
            [name]: value,
        }));
    };

    const openNewUsuarioDialog = () => {
        setUsuario({
            id: null,
            persona: {
                nombre: '',
                apellido_p: '',
                apellido_m: '',
                correo: '',
            },
            username: '',
            password: '',
            rol_id: 1,
            imagen: '',
        });
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
        setSubmitted(false);
    };

    const saveUsuario = async () => {
        setSubmitted(true);

        if (usuario.persona.nombre && usuario.persona.apellido_p && usuario.persona.correo && usuario.username && usuario.password) {
            try {
                if (usuario.id) {
                    await axios.put(`http://localhost:8000/api/usuario/${usuario.id}`, usuario);
                } else {
                    await axios.post(`http://localhost:8000/api/usuario`, usuario);
                }
                setDialogVisible(false);
                setUsuario({
                    id: null,
                    persona: {
                        nombre: '',
                        apellido_p: '',
                        apellido_m: '',
                        correo: '',
                    },
                    username: '',
                    password: '',
                    rol_id: 1,
                    imagen: '',
                });
                fetchUsuarios();
            } catch (error) {
                console.error("Error saving usuario:", error);
            }
        }
    };

    const editUsuario = (selectedUsuario) => {
        setUsuario(selectedUsuario);
        setDialogVisible(true);
    };

    const confirmDeleteUsuario = (selectedUsuario) => {
        setUsuario(selectedUsuario);
        setDeleteDialogVisible(true);
    };

    const deleteUsuario = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/usuario/${usuario.id}`);
            fetchUsuarios();
            setDeleteDialogVisible(false);
            setUsuario({
                id: null,
                persona: {
                    nombre: '',
                    apellido_p: '',
                    apellido_m: '',
                    correo: '',
                },
                username: '',
                password: '',
                rol_id: 1,
                imagen: '',
            });
        } catch (error) {
            console.error("Error deleting usuario:", error);
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveUsuario} />
        </div>
    );

    return (
        <div className="card shadow p-4">
            <h1 className="text-primary mb-4">Listado de Usuarios</h1>
            <Button label="Nuevo Usuario" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNewUsuarioDialog} />

            <DataTable value={usuarios} className="p-datatable-sm">
                <Column field="id" header="ID"></Column>
                <Column field="persona.nombre" header="Nombre"></Column>
                <Column field="persona.apellido_p" header="Apellido Paterno"></Column>
                <Column field="persona.apellido_m" header="Apellido Materno"></Column>
                <Column field="persona.correo" header="Correo"></Column>
                <Column field="username" header="Username"></Column>
                <Column field="rol.nombre" header="Rol"></Column>
                <Column body={(rowData) => (
                    <div className="p-d-flex p-jc-center">
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editUsuario(rowData)} />
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteUsuario(rowData)} />
                    </div>
                )} style={{ textAlign: 'center', width: '8em' }} />
            </DataTable>

            <Dialog visible={dialogVisible} style={{ width: '30rem', paddingBottom: '0' }} header={`${usuario.id ? 'Editar' : 'Nuevo'} Usuario`} modal className="p-fluid" onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                    <InputText id="nombre" value={usuario.persona.nombre} onChange={(e) => handleInputChange(e, 'persona.nombre')} autoFocus className="form-control" />
                    {submitted && !usuario.persona.nombre && <small className="p-error">El nombre es requerido.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="apellido_p" className="font-weight-bold">Apellido Paterno</label>
                    <InputText id="apellido_p" value={usuario.persona.apellido_p} onChange={(e) => handleInputChange(e, 'persona.apellido_p')} className="form-control" />
                    {submitted && !usuario.persona.apellido_p && <small className="p-error">El apellido paterno es requerido.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="apellido_m" className="font-weight-bold">Apellido Materno</label>
                    <InputText id="apellido_m" value={usuario.persona.apellido_m} onChange={(e) => handleInputChange(e, 'persona.apellido_m')} className="form-control" />
                </div>
                <div className="p-field">
                    <label htmlFor="correo" className="font-weight-bold">Correo</label>
                    <InputText id="correo" value={usuario.persona.correo} onChange={(e) => handleInputChange(e, 'persona.correo')} className="form-control" />
                    {submitted && !usuario.persona.correo && <small className="p-error">El correo es requerido.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="username" className="font-weight-bold">Username</label>
                    <InputText id="username" value={usuario.username} onChange={(e) => handleInputChange(e, 'username')} className="form-control" />
                    {submitted && !usuario.username && <small className="p-error">El username es requerido.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="password" className="font-weight-bold">Password</label>
                    <InputText id="password" type="password" value={usuario.password} onChange={(e) => handleInputChange(e, 'password')} className="form-control" />
                    {submitted && !usuario.password && <small className="p-error">El password es requerido.</small>}
                </div>
                <div className="p-d-flex p-jc-end mt-4">
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveUsuario} />
                </div>
            </Dialog>

            <Dialog visible={deleteDialogVisible} style={{ width: '30rem' }} header="Confirmación" modal footer={dialogFooter} onHide={() => setDeleteDialogVisible(false)}>
                <div className="p-d-flex p-ai-center p-p-3">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                    {usuario && (
                        <span>¿Seguro que quieres eliminar al usuario <b>{usuario.persona.nombre}</b>?</span>
                    )}
                    </div>
                    </Dialog>
                    </div>
                    );
                    };
                    
                    export default Usuarios;
