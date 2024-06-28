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
    CREATE: 6,
    EDIT: 7,
    DELETE: 8
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
            persona: { nombre: '', apellido_p: '', apellido_m: '', correo: '', nacimiento: '', celular: '', imagen: '.' },
            rol: { id: '', nombre: '' },
            photo: '.'
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

        if (usuario.username && (usuario.id || usuario.password) && usuario.persona.nombre && usuario.persona.apellido_p && usuario.persona.apellido_m && usuario.persona.correo && usuario.persona.nacimiento && usuario.persona.celular && usuario.rol.id) {
            try {
                const formData = new FormData();
                formData.append('photo', usuario.photo);
                formData.append('nombre', usuario.persona.nombre);
                formData.append('apellido_p', usuario.persona.apellido_p);
                formData.append('apellido_m', usuario.persona.apellido_m);
                formData.append('correo', usuario.persona.correo);
                formData.append('nacimiento', usuario.persona.nacimiento);
                formData.append('celular', usuario.persona.celular);
                formData.append('rol_id', usuario.rol.id);
                formData.append('username', usuario.username);
                if (!usuario.id) {
                    formData.append('password', usuario.password);
                }

                if (usuario.id) {
                    await axios.put(`http://3.147.242.40/api/usuario/${usuario.id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else {
                    await axios.post(`http://3.147.242.40/api/usuario`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }

                setUsuarioDialog(false);
                fetchUsuarios(); // Actualizar la lista de usuarios
                setUsuario({
                    id: null,
                    username: '',
                    password: '',
                    persona: { nombre: '', apellido_p: '', apellido_m: '', correo: '', nacimiento: '', celular: '', imagen: '.' },
                    rol: { id: '', nombre: '' },
                    photo: '.'
                });
            } catch (error) {
                console.error("Error saving usuario:", error.response ? error.response.data : error.message);
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

    const [filtroGlobal, setFiltroGlobal] = useState('');

    const onFiltroGlobalChange = (e) => {
        setFiltroGlobal(e.target.value);
    };

    const filterGlobal = (usuarios) => {
        return usuarios.filter(usuario =>
            usuario.persona.nombre.toLowerCase().includes(filtroGlobal.toLowerCase()) ||
            usuario.persona.apellido_p.toLowerCase().includes(filtroGlobal.toLowerCase()) ||
            usuario.rol.nombre.toLowerCase().includes(filtroGlobal.toLowerCase())
        );
    };

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Usuarios</h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nuevo Usuario" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}
                <div className="p-field">
                    <label htmlFor="filtroGlobal" className="font-weight-bold">Buscar</label>
                    <InputText id="filtroGlobal" value={filtroGlobal} onChange={onFiltroGlobalChange} className="form-control mb-4" />
                </div>
                <DataTable value={filterGlobal(usuarios)} className="p-datatable-sm">
                    <Column field="persona.nombre" header="Nombre" sortable />
                    <Column field="persona.apellido_p" header="Apellido" sortable />
                    <Column field="rol.nombre" header="Rol" sortable />
                    <Column field="persona.celular" header="Celular" sortable />
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button label="Ver Detalles" icon="pi pi-eye" className="p-button-rounded p-button-outlined p-button-success p-button-sm p-m-2" onClick={() => viewUsuario(rowData)} />
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button label="Editar" icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-info p-button-sm p-m-2" onClick={() => editUsuario(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button label="Eliminar" icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm p-m-2" onClick={() => confirmDeleteUsuario(rowData)} />
                            )}
                        </div>
                    )} />
                </DataTable>

                <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Usuario" modal className="p-fluid" footer={(
                    <React.Fragment>
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={hideDialog} />
                        {!viewMode && (
                            <Button label="Guardar" icon="pi pi-check" className="p-button-primary" onClick={saveUsuario} />
                        )}
                    </React.Fragment>
                )} onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <InputText id="username" value={usuario.username} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={submitted && !usuario.username ? 'p-invalid' : ''} />
                        {submitted && !usuario.username && <small className="p-error">El nombre de usuario es obligatorio.</small>}
                    </div>
                    {!usuario.id && (
                        <div className="p-field">
                            <label htmlFor="password">Contraseña</label>
                            <InputText id="password" type="password" value={usuario.password} onChange={(e) => onInputChange(e, 'password')} required className={submitted && !usuario.password ? 'p-invalid' : ''} />
                            {submitted && !usuario.password && <small className="p-error">La contraseña es obligatoria.</small>}
                        </div>
                    )}
                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" value={usuario.persona.nombre} onChange={(e) => onPersonaChange(e, 'nombre')} required className={submitted && !usuario.persona.nombre ? 'p-invalid' : ''} />
                        {submitted && !usuario.persona.nombre && <small className="p-error">El nombre es obligatorio.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="apellido_p">Apellido Paterno</label>
                        <InputText id="apellido_p" value={usuario.persona.apellido_p} onChange={(e) => onPersonaChange(e, 'apellido_p')} required className={submitted && !usuario.persona.apellido_p ? 'p-invalid' : ''} />
                        {submitted && !usuario.persona.apellido_p && <small className="p-error">El apellido paterno es obligatorio.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="apellido_m">Apellido Materno</label>
                        <InputText id="apellido_m" value={usuario.persona.apellido_m} onChange={(e) => onPersonaChange(e, 'apellido_m')} required className={submitted && !usuario.persona.apellido_m ? 'p-invalid' : ''} />
                        {submitted && !usuario.persona.apellido_m && <small className="p-error">El apellido materno es obligatorio.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="correo">Correo</label>
                        <InputText id="correo" value={usuario.persona.correo} onChange={(e) => onPersonaChange(e, 'correo')} required className={submitted && !usuario.persona.correo ? 'p-invalid' : ''} />
                        {submitted && !usuario.persona.correo && <small className="p-error">El correo es obligatorio.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="nacimiento">Fecha de Nacimiento</label>
                        <InputText id="nacimiento" type="date" value={usuario.persona.nacimiento} onChange={(e) => onPersonaChange(e, 'nacimiento')} required className={submitted && !usuario.persona.nacimiento ? 'p-invalid' : ''} />
                        {submitted && !usuario.persona.nacimiento && <small className="p-error">La fecha de nacimiento es obligatoria.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="celular">Celular</label>
                        <InputText id="celular" value={usuario.persona.celular} onChange={(e) => onPersonaChange(e, 'celular')} required className={submitted && !usuario.persona.celular ? 'p-invalid' : ''} />
                        {submitted && !usuario.persona.celular && <small className="p-error">El celular es obligatorio.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="rol">Rol</label>
                        <MultiSelect id="rol" value={usuario.rol.id ? [usuario.rol.id] : []} options={roles} onChange={onRoleChange} placeholder="Seleccionar Rol" required className={submitted && !usuario.rol.id ? 'p-invalid' : ''} disabled={viewMode} />
                        {submitted && !usuario.rol.id && <small className="p-error">Rol es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="photo">Foto</label>
                        <InputText id="photo" type="file" onChange={(e) => setUsuario({ ...usuario, photo: e.target.files[0] })} />
                    </div>
                </Dialog>

                <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={() => setDeleteUsuarioDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {usuario && <span>¿Está seguro de que desea eliminar <b>{usuario.persona.nombre}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Usuarios;
