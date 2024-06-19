import React, { useState, useEffect } from "react";
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
import { Dropdown } from 'primereact/dropdown';


const Ubicaciones = () => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [ubicacion, setUbicacion] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Función para obtener la lista de tipos de ubicaciones
    const fetchUbicaciones = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/ubicacion");
            setUbicaciones(response.data.data);
        } catch (error) {
            console.error("Error fetching ubicaciones:", error);
        }
    };

    // Cargar la lista de tipos de ubicaciones al cargar el componente
    useEffect(() => {
        fetchUbicaciones();
    }, []);

    const [tipoUbicaciones, setTipoUbicaciones] = useState([]);

// Función para obtener la lista de tipos de ubicaciones
const fetchTipoUbicaciones = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/tipo-ubicacion");
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
        let updatedUbicacion = { ...ubicacion, [name]: val };
        setUbicacion(updatedUbicacion);
    };

    // Abrir el diálogo para agregar/editar tipo de ubicación
    const openNew = () => {
        setUbicacion({ id: null, tipo: '', direccion: '',estantes: null});
        setProductDialog(true);
    };

    // Cerrar el diálogo de formulario
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    // Guardar un nuevo tipo de ubicación o actualizar uno existente
    const saveUbicacion = async () => {
        setSubmitted(true);
    
        // Verificar si tipo_id y direccion están definidos y no son vacíos
        if (ubicacion.tipo_id && ubicacion.direccion && ubicacion.direccion.trim()) {
            try {
                if (ubicacion.id) {
                    await axios.put(`http://127.0.0.1:8000/api/ubicacion/${ubicacion.id}`, ubicacion);
                } else {
                    await axios.post(`http://127.0.0.1:8000/api/ubicacion`, ubicacion);
                }
                setProductDialog(false);
                setUbicacion(null);
                fetchUbicaciones();
            } catch (error) {
                console.log("Error saving tipo ubicacion:", error);
            }
        } else {
            console.log("Tipo de ubicacion o direccion no válidos:", ubicacion);
        }
    };

    // Abrir el diálogo para editar un tipo de ubicación existente
    const editUbicacion = (ubicacion) => {
        setUbicacion(ubicacion);
        setProductDialog(true);
    };

    // Abrir el diálogo para confirmar la eliminación de un tipo de ubicación
    const confirmDeleteUbicacion = (ubicacion) => {
        setUbicacion(ubicacion);
        setDeleteProductsDialog(true);
    };

    // Eliminar un tipo de ubicación
    const deleteUbicacion = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/ubicacion/${ubicacion.id}`);
            fetchUbicaciones();
            setDeleteProductsDialog(false);
            setUbicacion(null);
        } catch (error) {
            console.log("Error deleting ubicacion:", error);
        }
    };

    // Renderizar el pie de página del diálogo de confirmación de eliminación
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteUbicacion} />
        </React.Fragment>
    );

    // Renderizar el componente
    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h2 className="text-primary mb-4">Listado de Ubicaciones</h2>
                <Button label="Nueva Ubicación" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />

                <DataTable value={ubicaciones} className="p-datatable-sm">
                    <Column field="direccion" header="Direccion"></Column>
                    <Column field="tipo_ubicacion.nombre" header="Tipo Ubicacion"></Column>
                    <Column field="cant_estantes" header="Cantidad Estantes"></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editUbicacion(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteUbicacion(rowData)} />
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${ubicacion ? 'Editar' : 'Nuevo'} Ubicación`} modal className="p-fluid" onHide={hideDialog}>
                    
                <div className="p-field">
                    <label htmlFor="tipo-ubicacion" className="font-weight-bold">Tipo Ubicación</label>
                    <Dropdown
                        id="tipo-ubicacion"
                        value={ubicacion?.tipo_id || null}
                        options={tipoUbicaciones.map(tipo => ({ label: tipo.nombre, value: tipo.id }))}
                        onChange={(e) => onInputChange(e, 'tipo_id')}
                        optionLabel="label"
                        placeholder="Seleccione un tipo de ubicación"
                        className="form-control"
                    />
                    {submitted && !ubicacion?.tipo_id && <small className="p-error">El tipo de ubicación es requerido.</small>}
                </div>
                    
                    <div className="p-field">
                        <label htmlFor="direccion" className="font-weight-bold">Direccion</label>
                        <InputText id="direccion" value={ubicacion?.direccion || ''} onChange={(e) => onInputChange(e, 'direccion')} required autoFocus className="form-control" />
                        {submitted && !ubicacion?.direccion && <small className="p-error">La direccion es requerida.</small>}
                    </div>
                    
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveUbicacion} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {ubicacion && (
                            <span>¿Seguro que quieres eliminar el tipo de ubicación <b>{ubicacion.direccion}</b>?</span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Ubicaciones;