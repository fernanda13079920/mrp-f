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

const Usuarios = () => {
    const { authData } = useContext(AuthContext);
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState({
        id: null,
        username: '',
        password: '',
        persona: { nombre: '', apellido_p: '', apellido_m: '', correo: '', nacimiento: '', celular: '', imagen: '' },
        rol: { id: '', nombre: '' },
        photo: ''
    });
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/usuario");
            setUsuarios(response.data.data);
            console.log('Usuarios fetched:', response.data.data);
        } catch (error) {
            console.error("Error fetching usuarios:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/rol");
            setRoles(response.data.data.map(r => ({ label: r.nombre, value: r.id })));
            console.log('Roles fetched:', response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedUsuario = { ...usuario, [name]: val };
        setUsuario(updatedUsuario);
    };

    const onPersonaChange = (e, name) => {
        const val = e.target.value;
        let updatedUsuario = { ...usuario, persona: { ...usuario.persona, [name]: val } };
        setUsuario(updatedUsuario);
    };

    const onRoleChange = (e) => {
        const val = e.value;
        const selectedRole = roles.find(r => r.value === val[0]); // Obtener el primer elemento ya que MultiSelect devuelve un array
        if (selectedRole) {
            let updatedUsuario = { ...usuario, rol: { id: val[0], nombre: selectedRole.label } };
            setUsuario(updatedUsuario);
        }
    };

    const openNew = () => {
        setUsuario({
            id: null,
            username: '',
            password: '',
            persona: { nombre: '', apellido_p: '', apellido_m: '', correo: '', nacimiento: '', celular: '', imagen: '' },
            rol: { id: '', nombre: '' },
            photo: ''
        });
        setSubmitted(false);
        setViewMode(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setUsuarioDialog(false);
        setSubmitted(false);
    };

    const saveUsuario = async () => {
        setSubmitted(true);

        if (usuario.username && usuario.password && usuario.persona.nombre && usuario.persona.apellido_p && usuario.persona.correo && usuario.rol.id) {
            try {
                const payload = {
                    ...usuario,
                    photo: '', // Asegurar que la foto esté vacía
                };

                if (usuario.id) {
                    await axios.put(`http://3.147.242.40/api/usuario/${usuario.id}`, payload);
                } else {
                    await axios.post(`http://3.147.242.40/api/usuario`, payload);
                }

                setUsuarioDialog(false);
                fetchUsuarios(); // Actualizar la lista de usuarios
                setUsuario({
                    id: null,
                    username: '',
                    password: '',
                    persona: { nombre: '', apellido_p: '', apellido_m: '', correo: '', nacimiento: '', celular: '', imagen: '' },
                    rol: { id: '', nombre: '' },
                    photo: ''
                });
            } catch (error) {
                console.error("Error saving usuario:", error);
            }
        }
    };

    const viewUsuario = (usuario) => {
        setUsuario({
            ...usuario,
            rol: { id: usuario.rol.id, nombre: usuario.rol.nombre },
        });
        setViewMode(true);
        setUsuarioDialog(true);
    };

    const editUsuario = (usuario) => {
        setUsuario({
            ...usuario,
            rol: { id: usuario.rol.id, nombre: usuario.rol.nombre },
        });
        setViewMode(false);
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/usuario/${usuario.id}`);
            fetchUsuarios();
            setDeleteUsuarioDialog(false);
            setUsuario({
                id: null,
                username: '',
                password: '',
                persona: { nombre: '', apellido_p: '', apellido_m: '', correo: '', nacimiento: '', celular: '', imagen: '' },
                rol: { id: '', nombre: '' },
                photo: ''
            });
        } catch (error) {
            console.error("Error deleting usuario:", error);
        }
    };

    const deleteUsuarioDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteUsuarioDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteUsuario} />
        </React.Fragment>
    );

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Usuarios</h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nuevo Usuario" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}

                <DataTable value={usuarios} className="p-datatable-sm">
                    <Column field="persona.nombre" header="Nombre" />
                    <Column field="persona.apellido_p" header="Apellido" />
                    <Column field="rol.nombre" header="Rol" />
                    <Column field="persona.celular" header="Celular" />
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button label="Ver Detalles" icon="pi pi-eye" className="p-button-rounded p-button-outlined p-button-success p-button-sm p-m-2" onClick={() => viewUsuario(rowData)} />
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-m-2" onClick={() => editUsuario(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteUsuario(rowData)} />
                            )}
                        </div>
                    )} style={{ textAlign: 'center', width: '12em' }} />
                </DataTable>

                <Dialog visible={usuarioDialog} style={{ width: '40rem', overflowY: 'auto', paddingBottom: '0' }} header={`${usuario && usuario.id ? (viewMode ? 'Ver' : 'Editar') : 'Nuevo'} Usuario`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="username" className="font-weight-bold">Username</label>
                        <InputText id="username" value={usuario?.username || ''} onChange={(e) => onInputChange(e, 'username')} required autoFocus className="form-control" disabled={viewMode} />
                        {submitted && !usuario?.username && <small className="p-error">El username es requerido.</small>}
                    </div>
                    {!viewMode && !usuario.id && (
                        <div className="p-field">
                            <label htmlFor="password" className="font-weight-bold">Password</label>
                            <InputText id="password" type="password" value={usuario?.password || ''} onChange={(e) => onInputChange(e, 'password')} required className="form-control" />
                            {submitted && !usuario?.password && <small className="p-error">La contraseña es requerida.</small>}
                        </div>
                    )}
                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <InputText id="nombre" value={usuario?.persona.nombre || ''} onChange={(e) => onPersonaChange(e, 'nombre')} required autoFocus className="form-control" disabled={viewMode} />
                        {submitted && !usuario?.persona.nombre && <small className="p-error">El nombre es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="apellido_p" className="font-weight-bold">Apellido Paterno</label>
                        <InputText id="apellido_p" value={usuario?.persona.apellido_p || ''} onChange={(e) => onPersonaChange(e, 'apellido_p')} required autoFocus className="form-control" disabled={viewMode} />
                        {submitted && !usuario?.persona.apellido_p && <small className="p-error">El apellido paterno es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="apellido_m" className="font-weight-bold">Apellido Materno</label>
                        <InputText id="apellido_m" value={usuario?.persona.apellido_m || ''} onChange={(e) => onPersonaChange(e, 'apellido_m')} required autoFocus className="form-control" disabled={viewMode} />
                        {submitted && !usuario?.persona.apellido_m && <small className="p-error">El apellido materno es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="correo" className="font-weight-bold">Correo</label>
                        <InputText id="correo" value={usuario?.persona.correo || ''} onChange={(e) => onPersonaChange(e, 'correo')} required autoFocus className="form-control" disabled={viewMode} />
                        {submitted && !usuario?.persona.correo && <small className="p-error">El correo es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="nacimiento" className="font-weight-bold">Fecha de Nacimiento</label>
                        <InputText id="nacimiento" value={usuario?.persona.nacimiento || ''} onChange={(e) => onPersonaChange(e, 'nacimiento')} required autoFocus className="form-control" disabled={viewMode} />
                        {submitted && !usuario?.persona.nacimiento && <small className="p-error">La fecha de nacimiento es requerida.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="celular" className="font-weight-bold">Celular</label>
                        <InputText id="celular" value={usuario?.persona.celular || ''} onChange={(e) => onPersonaChange(e, 'celular')} required autoFocus className="form-control" disabled={viewMode} />
                        {submitted && !usuario?.persona.celular && <small className="p-error">El celular es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="rol" className="font-weight-bold">Rol</label>
                        <MultiSelect
                            id="rol"
                            value={usuario?.rol.id ? [usuario.rol.id] : []}
                            options={roles}
                            onChange={onRoleChange}
                            optionLabel="label"
                            placeholder="Seleccione rol"
                            className="form-control"
                            display="chip"
                            disabled={viewMode}
                        />
                        {submitted && !usuario?.rol.id && <small className="p-error">Debe seleccionar un rol.</small>}
                    </div>
                    {!viewMode && (
                        <div className="p-d-flex p-jc-end mt-5">
                            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger p-ml-2" onClick={hideDialog} />
                            <Button label="Guardar" icon="pi pi-check" className="p-button-success p-ml-2" onClick={saveUsuario} />
                        </div>
                    )}
                </Dialog>
                <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={() => setDeleteUsuarioDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        {usuario && <span>¿Estás seguro de que deseas eliminar <b>{usuario.persona.nombre} {usuario.persona.apellido_p}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Usuarios;

