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

const Procesos = () => {
    const [procesos, setProcesos] = useState([]);
    const [proceso, setProceso] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Función para obtener la lista de tipos de ubicaciones
    const fetchProcesos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/proceso");
            setProcesos(response.data.data);
        } catch (error) {
            console.error("Error fetching tipo ubicaciones:", error);
        }
    };

    // Cargar la lista de tipos de ubicaciones al cargar el componente
    useEffect(() => {
        fetchProcesos();
    }, []);

    // Manejar cambios en los inputs del formulario
    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedProceso = { ...proceso, [name]: val };
        setProceso(updatedProceso);
    };

    // Abrir el diálogo para agregar/editar tipo de ubicación
    const openNew = () => {
        setProceso({ id: null, nombre: '', descr });
        setProductDialog(true);
    };

    // Cerrar el diálogo de formulario
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    // Guardar un nuevo tipo de ubicación o actualizar uno existente
    const saveProceso = async () => {
        setSubmitted(true);

        if ( proceso.nombre && proceso.descripcion && proceso.descripcion.trim()) {
            try {
                if (proceso.id) {
                    await axios.put(`http://127.0.0.1:8000/api/proceso/${proceso.id}`, proceso);
                } else {
                    await axios.post(`http://127.0.0.1:8000/api/proceso`, proceso);
                }
                setProductDialog(false);
                setProceso(null);
                fetchProcesos();
            } catch (error) {
                console.log("Error saving tipo ubicacion:", error);
            }
        }
    };

    // Abrir el diálogo para editar un tipo de ubicación existente
    const editProceso = (proceso) => {
        setProceso(proceso);
        setProductDialog(true);
    };

    // Abrir el diálogo para confirmar la eliminación de un tipo de ubicación
    const confirmDeleteProceso = (proceso) => {
        setProceso(proceso);
        setDeleteProductsDialog(true);
    };

    // Eliminar un tipo de ubicación
    const deleteProceso = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/proceso/${proceso.id}`);
            fetchProcesos();
            setDeleteProductsDialog(false);
            setProceso(null);
        } catch (error) {
            console.log("Error deleting tipo ubicacion:", error);
        }
    };

    // Renderizar el pie de página del diálogo de confirmación de eliminación
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteProceso} />
        </React.Fragment>
    );

    // Renderizar el componente
    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Tipos de Ubicación</h1>
                <Button label="Nuevo Tipo de Ubicación" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />

                <DataTable value={procesos} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="descripcion" header="Descripcion"></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editProceso(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteProceso(rowData)} />
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${proceso ? 'Editar' : 'Nuevo'} Tipo de Ubicación`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <InputText id="nombre" value={proceso?.nombre || ''} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className="form-control" />
                        {submitted && !proceso?.nombre && <small className="p-error">El nombre es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="descripcion" className="font-weight-bold">Descripcion</label>
                        <InputText id="descripcion" value={proceso?.descripcion || ''} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className="form-control" />
                        {submitted && !proceso?.descripcion && <small className="p-error">El nombre es requerido.</small>}
                    </div>
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveProceso} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {proceso && (
                            <span>¿Seguro que quieres eliminar el tipo de ubicación <b>{proceso.nombre}</b>?</span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Procesos;
