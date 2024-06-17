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
import { Dropdown } from 'primereact/dropdown';
import styled, { ThemeContext } from 'styled-components';

const Estantes = () => {
    const { theme } = useContext(ThemeContext); // Acceder al tema actual
    const [estantes, setEstantes] = useState([]);
    const [estante, setEstante] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Función para obtener la lista de tipos de estantes
    const fetchEstantes = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/estante");
            setEstantes(response.data.data);
        } catch (error) {
            console.error("Error fetching estantes:", error);
        }
    };

    // Cargar la lista de tipos de estantes al cargar el componente
    useEffect(() => {
        fetchEstantes();
    }, []);

    const [ubicaciones, setUbicaciones] = useState([]);

// Función para obtener la lista de tipos de estantes
const fetchUbicaciones = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/ubicacion");
        setUbicaciones(response.data.data);
    } catch (error) {
        console.error("Error fetching tipo estantes:", error);
    }
};

// Cargar la lista de tipos de estantes al cargar el componente
useEffect(() => {
    fetchUbicaciones();
}, []);

    // Manejar cambios en los inputs del formulario
    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedEstante = { ...estante, [name]: val };
        setEstante(updatedEstante);
    };

    // Abrir el diálogo para agregar/editar tipo de ubicación
    const openNew = () => {
        setEstante({ id: null, ubicacion_id: '', cant_fila: ''});
        setProductDialog(true);
    };

    // Cerrar el diálogo de formulario
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    // Guardar un nuevo tipo de ubicación o actualizar uno existente
    const saveEstante = async () => {
        setSubmitted(true);
    
        // Verificar si tipo_id y direccion están definidos y no son vacíos
        if (estante.ubicacion_id && estante.cant_fila && estante.cant_fila.trim()) {
            try {
                if (estante.id) {
                    await axios.put(`http://127.0.0.1:8000/api/estante/${estante.id}`, estante);
                } else {
                    await axios.post(`http://127.0.0.1:8000/api/estante`, estante);
                }
                setProductDialog(false);
                setEstante(null);
                fetchEstantes();
            } catch (error) {
                console.log("Error saving tipo estante:", error);
            }
        } else {
            console.log("Tipo de estante o direccion no válidos:", estante);
        }
    };

    // Abrir el diálogo para editar un tipo de ubicación existente
    const editEstante = (estante) => {
        setEstante(estante);
        setProductDialog(true);
    };

    // Abrir el diálogo para confirmar la eliminación de un tipo de ubicación
    const confirmDeleteEstante = (estante) => {
        setEstante(estante);
        setDeleteProductsDialog(true);
    };

    // Eliminar un tipo de ubicación
    const deleteEstante = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/estante/${estante.id}`);
            fetchEstantes();
            setDeleteProductsDialog(false);
            setEstante(null);
        } catch (error) {
            console.log("Error deleting estante:", error);
        }
    };

    // Renderizar el pie de página del diálogo de confirmación de eliminación
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteEstante} />
        </React.Fragment>
    );

    // Renderizar el componente
    return (
        <Container>
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Estantes</h1>
                <Button label="Nueva Ubicación" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />

                <DataTable value={estantes} className="p-datatable-sm">
                    <Column field="ubicacion.direccion" header="Direccion"></Column>
                    <Column field="cant_fila" header="Cantidad Filas"></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editEstante(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteEstante(rowData)} />
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${estante ? 'Editar' : 'Nuevo'} Estante`} modal className="p-fluid" onHide={hideDialog}>
                    
                                <div className="p-field">
                    <label htmlFor="ubicacion" className="font-weight-bold">Ubicación</label>
                    <Dropdown
                        id="ubicacion"
                        value={estante?.ubicacion_id || null}
                        options={ubicaciones.map(ubicacion => ({ label: ubicacion.direccion, value: ubicacion.id }))}
                        onChange={(e) => onInputChange(e, 'ubicacion_id')}
                        optionLabel="label"
                        placeholder="Seleccione una ubicación"
                        className="form-control"
                        style={{ width: '100%' }}
                        theme={theme} // Aplicar el tema aquí
                    />
                    {submitted && !estante?.ubicacion_id && <small className="p-error">El tipo de ubicación es requerido.</small>}
                </div>
                    
                <div className="p-field">
                    <label htmlFor="cant_fila" className="font-weight-bold">Cantidad Filas</label>
                    <InputText id="cant_fila" value={estante?.cant_fila || ''} onChange={(e) => onInputChange(e, 'cant_fila')} required autoFocus className="form-control" />
                    {submitted && !estante?.cant_fila && <small className="p-error">La direccion es requerida.</small>}
                </div>
                    
                <div className="p-d-flex p-jc-end mt-4">
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveEstante} />
                </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {estante && (
                            <span>¿Seguro que quieres eliminar el tipo de ubicación <b>{estante.nombre}</b>?</span>
                        )}
                    </div>
                </Dialog>
            </div>
        </Container>
    );
};

const Container = styled.div`
    background: ${({ theme }) => theme.bg}; /* Aplicar color de fondo del tema */
    color: ${({ theme }) => theme.text}; /* Aplicar color de texto del tema */
    padding: 20px;
    overflow-y: auto;
`;

export default Estantes;

