import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos base de PrimeReact
import 'primeflex/primeflex.css'; // Estilos de PrimeFlex para alineación y disposición
import { AuthContext } from '../context/authContext';
const PERMISOS = {
    CREATE: 26,
    EDIT: 27,
    DELETE: 28
};
const TipoUbicaciones = () => {
    const { authData } = useContext(AuthContext);
    const [tipoUbicaciones, setTipoUbicaciones] = useState([]);
    const [tipoUbicacion, setTipoUbicacion] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Función para obtener la lista de tipos de ubicaciones
    const fetchTipoUbicaciones = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/tipo-ubicacion");
            setTipoUbicaciones(response.data.data);
        } catch (error) {
            console.error("Error fetching tipo ubicaciones:", error);
        }
    };

    // Cargar la lista de tipos de ubicaciones al cargar el componente
    useEffect(() => {
        fetchTipoUbicaciones();
    }, []);

    // Manejar cambios en los inputs del formulario
    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedTipoUbicacion = { ...tipoUbicacion, [name]: val };
        setTipoUbicacion(updatedTipoUbicacion);
    };

    // Abrir el diálogo para agregar/editar tipo de ubicación
    const openNew = () => {
        setTipoUbicacion({ id: null, nombre: '' });
        setProductDialog(true);
    };

    // Cerrar el diálogo de formulario
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    // Guardar un nuevo tipo de ubicación o actualizar uno existente
    const saveTipoUbicacion = async () => {
        setSubmitted(true);

        if (tipoUbicacion.nombre && tipoUbicacion.nombre.trim()) {
            try {
                if (tipoUbicacion.id) {
                    await axios.put(`http://3.147.242.40/api/tipo-ubicacion/${tipoUbicacion.id}`, tipoUbicacion);
                } else {
                    await axios.post(`http://3.147.242.40/api/tipo-ubicacion`, tipoUbicacion);
                }
                setProductDialog(false);
                setTipoUbicacion(null);
                fetchTipoUbicaciones();
            } catch (error) {
                console.log("Error saving tipo ubicacion:", error);
            }
        }
    };

    // Abrir el diálogo para editar un tipo de ubicación existente
    const editTipoUbicacion = (tipoUbicacion) => {
        setTipoUbicacion(tipoUbicacion);
        setProductDialog(true);
    };

    // Abrir el diálogo para confirmar la eliminación de un tipo de ubicación
    const confirmDeleteTipoUbicacion = (tipoUbicacion) => {
        setTipoUbicacion(tipoUbicacion);
        setDeleteProductsDialog(true);
    };

    // Eliminar un tipo de ubicación
    const deleteTipoUbicacion = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/tipo-ubicacion/${tipoUbicacion.id}`);
            fetchTipoUbicaciones();
            setDeleteProductsDialog(false);
            setTipoUbicacion(null);
        } catch (error) {
            console.log("Error deleting tipo ubicacion:", error);
        }
    };

    // Renderizar el pie de página del diálogo de confirmación de eliminación
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteTipoUbicacion} />
        </React.Fragment>
    );
    const [filtroGlobal, setFiltroGlobal] = useState('');

    const onFiltroGlobalChange = (e) => {
        setFiltroGlobal(e.target.value);
    };

    const filterGlobal = (tipoUbicaciones) => {
        return tipoUbicaciones.filter(tipoUbicacion =>
            tipoUbicacion.nombre.toLowerCase().includes(filtroGlobal.toLowerCase())
        );
    };
    // Renderizar el componente
    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Tipos de Ubicación</h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nuevo Tipo de Ubicación" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}
                <div className="p-field">
                    <label htmlFor="filtroGlobal" className="font-weight-bold">Buscar</label>
                    <InputText id="filtroGlobal" value={filtroGlobal} onChange={onFiltroGlobalChange} className="form-control mb-4" />
                </div>
                <DataTable value={filterGlobal(tipoUbicaciones)} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editTipoUbicacion(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteTipoUbicacion(rowData)} />
                            )}
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${tipoUbicacion ? 'Editar' : 'Nuevo'} Tipo de Ubicación`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <InputText id="nombre" value={tipoUbicacion?.nombre || ''} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className="form-control" />
                        {submitted && !tipoUbicacion?.nombre && <small className="p-error">El nombre es requerido.</small>}
                    </div>
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveTipoUbicacion} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {tipoUbicacion && (
                            <span>¿Seguro que quieres eliminar el tipo de ubicación <b>{tipoUbicacion.nombre}</b>?</span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default TipoUbicaciones;
