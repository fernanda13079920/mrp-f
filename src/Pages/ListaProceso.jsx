import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';

const ListaProcesos = () => {
    const [listaProcesos, setListaProcesos] = useState([]);
    const [selectedProceso, setSelectedProceso] = useState(null);
    const [deleteProcesoDialog, setDeleteProcesoDialog] = useState(false);
    const [procesoDialog, setProcesoDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchListaProcesos();
    }, []);

    const fetchListaProcesos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/lista-proceso");
            setListaProcesos(response.data.data);
        } catch (error) {
            console.error("Error fetching process list:", error);
        }
    };
    const [procesos, setProcesos] = useState([]);

    const fetchProcesos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/procesos");
            const allProcesos = response.data.data;
            // Filtrar procesos por ID
            const filteredProcesos = allProcesos.filter(proceso => proceso.id === selectedProceso?.proceso_id);
            setProcesos(filteredProcesos);
        } catch (error) {
            console.error("Error al obtener procesos:", error);
        }
    };
    

    useEffect(() => {
        fetchProcesos();
    }, []);
    const openNewProcesoDialog = () => {
        setSelectedProceso(null);
        setProcesoDialog(true);
    };

    const hideProcesoDialog = () => {
        setProcesoDialog(false);
        setSubmitted(false);
    };

    const saveProceso = async () => {
        setSubmitted(true);

        try {
            if (selectedProceso.id) {
                await axios.put(`http://3.147.242.40/api/lista-proceso/${selectedProceso.id}`, selectedProceso);
            } else {
                await axios.post(`http://3.147.242.40/api/lista-proceso`, selectedProceso);
            }
            setProcesoDialog(false);
            setSelectedProceso(null);
            fetchListaProcesos();
        } catch (error) {
            console.error("Error saving process:", error);
        }
    };

    const deleteProceso = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/lista-proceso/${selectedProceso.id}`);
            fetchListaProcesos();
            setDeleteProcesoDialog(false);
            setSelectedProceso(null);
        } catch (error) {
            console.error("Error deleting process:", error);
        }
    };

    const confirmDeleteProceso = (proceso) => {
        setSelectedProceso(proceso);
        setDeleteProcesoDialog(true);
    };

    const editProceso = (proceso) => {
        setSelectedProceso({ ...proceso });
        setProcesoDialog(true);
    };

    const procesoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideProcesoDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-primary" onClick={saveProceso} />
        </React.Fragment>
    );

    const deleteProcesoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteProcesoDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteProceso} />
        </React.Fragment>
    );

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Procesos</h1>

                <Button label="Nuevo Proceso" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNewProcesoDialog} />

                <DataTable value={listaProcesos} className="p-datatable-sm">
                    <Column field="producto.nombre" header="Nombre del Producto"></Column>
                    <Column field="proceso" header="Nombre del Proceso"></Column>
                    <Column field="paso" header="Paso"></Column>
                    <Column field="tiempo" header="Tiempo"></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editProceso(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteProceso(rowData)} />
                        </div>
                    )} style={{ textAlign: 'center', width: '15em' }} />
                </DataTable>

                <Dialog visible={procesoDialog} style={{ width: '40rem' }} header={`${selectedProceso ? 'Editar' : 'Nuevo'} Proceso`} modal className="p-fluid" onHide={hideProcesoDialog}>
                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre del Proceso</label>
                        <InputText id="nombre" value={selectedProceso?.proceso || ''} onChange={(e) => setSelectedProceso({ ...selectedProceso, proceso: e.target.value })} required autoFocus className="form-control" />
                    </div>

                    <div className="p-field">
                        <label htmlFor="paso" className="font-weight-bold">Paso</label>
                        <InputText id="paso" value={selectedProceso?.paso || ''} onChange={(e) => setSelectedProceso({ ...selectedProceso, paso: e.target.value })} required autoFocus className="form-control" />
                    </div>

                    <div className="p-field">
                        <label htmlFor="tiempo" className="font-weight-bold">Tiempo</label>
                        <InputText id="tiempo" value={selectedProceso?.tiempo || ''} onChange={(e) => setSelectedProceso({ ...selectedProceso, tiempo: e.target.value })} required autoFocus className="form-control" />
                    </div>

                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideProcesoDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveProceso} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProcesoDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProcesoDialogFooter} onHide={() => setDeleteProcesoDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {selectedProceso && (
                            <span>¿Seguro que quieres eliminar el proceso <b>{selectedProceso.proceso}</b>?</span>
                        )}
                    </div>
                </Dialog>

            </div>
        </div>
    );
};

export default ListaProcesos;
