import React, { useState, useEffect, useContext } from "react";
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
import { Dropdown } from 'primereact/dropdown';
import styled, { ThemeContext } from 'styled-components';
import { AuthContext } from '../context/authContext';

const PERMISOS = {
    CREATE: 30,
    EDIT: 31,
    DELETE: 32
};

const Estantes = () => {
    const { theme } = useContext(ThemeContext);
    const { authData } = useContext(AuthContext);
    const [estantes, setEstantes] = useState([]);
    const [estante, setEstante] = useState(null);
    const [deleteEstantesDialog, setDeleteEstantesDialog] = useState(false);
    const [estanteDialog, setEstanteDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fetchEstantes = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/estante");
            setEstantes(response.data.data);
        } catch (error) {
            console.error("Error fetching estantes:", error);
        }
    };

    useEffect(() => {
        fetchEstantes();
    }, []);

    const [ubicaciones, setUbicaciones] = useState([]);

    const fetchUbicaciones = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/ubicacion");
            setUbicaciones(response.data.data);
        } catch (error) {
            console.error("Error fetching ubicaciones:", error);
        }
    };

    useEffect(() => {
        fetchUbicaciones();
    }, []);

    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedEstante = { ...estante, [name]: val };
        setEstante(updatedEstante);
    };

    const openNew = () => {
        setEstante({ id: null, ubicacion_id: '', cant_fila: '' });
        setEstanteDialog(true);
    };

    const hideDialog = () => {
        setEstanteDialog(false);
        setSubmitted(false);
    };

    const saveEstante = async () => {
        setSubmitted(true);
        if (estante.ubicacion_id && estante.cant_fila && estante.cant_fila.trim()) {
            try {
                if (estante.id) {
                    await axios.put(`http://3.147.242.40/api/estante/${estante.id}`, estante);
                } else {
                    await axios.post(`http://3.147.242.40/api/estante`, estante);
                }
                setEstanteDialog(false);
                setEstante(null);
                fetchEstantes();
            } catch (error) {
                console.log("Error saving estante:", error);
            }
        }
    };

    const editEstante = (estante) => {
        setEstante(estante);
        setEstanteDialog(true);
    };

    const confirmDeleteEstante = (estante) => {
        setEstante(estante);
        setDeleteEstantesDialog(true);
    };

    const deleteEstante = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/estante/${estante.id}`);
            fetchEstantes();
            setDeleteEstantesDialog(false);
            setEstante(null);
        } catch (error) {
            console.log("Error deleting estante:", error);
        }
    };

    const deleteEstantesDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteEstantesDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteEstante} />
        </React.Fragment>
    );

    return (
        <Container>
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Estantes</h1>
                {authData.permisos.includes(PERMISOS.VIEW) && (
                    <>
                        {authData.permisos.includes(PERMISOS.CREATE) && (
                            <Button label="Nuevo Estante" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                        )}

                        <DataTable value={estantes} className="p-datatable-sm">
                            <Column field="ubicacion.direccion" header="Direccion"></Column>
                            <Column field="cant_fila" header="Cantidad Filas"></Column>
                            <Column body={(rowData) => (
                                <div className="p-d-flex p-jc-center">
                                    {authData.permisos.includes(PERMISOS.EDIT) && (
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editEstante(rowData)} />
                                    )}
                                    {authData.permisos.includes(PERMISOS.DELETE) && (
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteEstante(rowData)} />
                                    )}
                                </div>
                            )} style={{ textAlign: 'center', width: '8em' }} />
                        </DataTable>
                    </>
                )}

                <Dialog visible={estanteDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${estante ? 'Editar' : 'Nuevo'} Estante`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="ubicacion" className="font-weight-bold">Ubicación</label>
                        <Dropdown
                            id="ubicacion"
                            value={estante?.ubicacion_id || null}
                            options={ubicaciones.map(ubicacion => ({ label: ubicacion.direccion, value: ubicacion.id }))}
                            onChange={(e) => onInputChange(e, 'ubicacion_id')}
                            optionLabel="label"
                            placeholder="Seleccione un tipo"
                            className="p-inputtext"
                            style={{ width: '100%' }}
                            theme={theme}
                        />
                        {submitted && !estante?.ubicacion_id && <small className="p-error">La ubicación es requerida.</small>}
                    </div>
                    
                    <div className="p-field">
                        <label htmlFor="cant_fila" className="font-weight-bold">Cantidad Filas</label>
                        <InputText id="cant_fila" value={estante?.cant_fila || ''} onChange={(e) => onInputChange(e, 'cant_fila')} required autoFocus className="form-control" />
                        {submitted && !estante?.cant_fila && <small className="p-error">La cantidad de filas es requerida.</small>}
                    </div>
                    
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveEstante} />
                    </div>
                </Dialog>

                <Dialog visible={deleteEstantesDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteEstantesDialogFooter} onHide={() => setDeleteEstantesDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {estante && (
                            <span>¿Seguro que quieres eliminar el estante <b>{estante.nombre}</b>?</span>
                        )}
                    </div>
                </Dialog>
            </div>
        </Container>
    );
};

const Container = styled.div`
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    padding: 20px;
    overflow-y: auto;
`;

export default Estantes;

