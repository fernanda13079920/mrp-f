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
import { Dropdown } from 'primereact/dropdown';

const UbicacionArticulos = () => {
    const [ubicacionArticulos, setUbicacionArticulos] = useState([]);
    const [ubicacionArticulo, setUbicacionArticulo] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Función para obtener la lista de ubicación artículos
    const fetchUbicacionArticulos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/ubicacion-articulo");
            setUbicacionArticulos(response.data.data);
        } catch (error) {
            console.error("Error fetching ubicacion articulos:", error);
        }
    };

    useEffect(() => {
        fetchUbicacionArticulos();
    }, []);
    const [estantes, setEstantes] = useState([]);
    // Función para obtener la lista de tipos de estantes
    const fetchEstantes = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/estante");
            setEstantes(response.data.data);
        } catch (error) {
            console.error("Error fetching estantes:", error);
        }
    };

    useEffect(() => {
        fetchUbicacionArticulos();
        fetchEstantes();
    }, []);
    const [articulos, setArticulos] = useState([]);
    // Función para obtener la lista de tipos de estantes
    const fetchArticulos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/articulo");
            setArticulos(response.data.data);
        } catch (error) {
            console.error("Error fetching estantes:", error);
        }
    };

    // Cargar la lista de tipos de estantes al cargar el componente
    useEffect(() => {
        fetchArticulos();
    }, []);
    // Manejar cambios en los inputs del formulario
    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedUbicacionArticulo = { ...ubicacionArticulo, [name]: val };
        setUbicacionArticulo(updatedUbicacionArticulo);
    };

    // Abrir el diálogo para agregar/editar ubicación artículo
    const openNew = () => {
        setUbicacionArticulo({ id: null, estante_id: '', articulo_id: '', fila: '', cant_articulo: '' });
        setProductDialog(true);
    };

    // Cerrar el diálogo de formulario
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    const editUbicacionArticulo = (ubicacionArticulo) => {
        setUbicacionArticulo({ ...ubicacionArticulo });  // Clonar el objeto para evitar mutaciones directas
        setProductDialog(true);
    };
    
    // Función para guardar un nuevo ubicación artículo o actualizar uno existente
    const saveUbicacionArticulo = async () => {
        setSubmitted(true);
    
        if (ubicacionArticulo.estante_id && ubicacionArticulo.articulo_id && ubicacionArticulo.fila && ubicacionArticulo.cant_articulo) {
            try {
                let response;
                if (ubicacionArticulo.id) {
                    response = await axios.put(`http://127.0.0.1:8000/api/ubicacion-articulo/${ubicacionArticulo.id}`, ubicacionArticulo);
                } else {
                    response = await axios.post(`http://127.0.0.1:8000/api/ubicacion-articulo`, ubicacionArticulo);
                }
                if (response.status === 200 || response.status === 201) {
                    setProductDialog(false);
                    setUbicacionArticulo(null);
                    fetchUbicacionArticulos();
                } else {
                    console.log("Error al guardar ubicación articulo:", response);
                }
            } catch (error) {
                console.log("Error al guardar ubicación articulo:", error);
            }
        } else {
            console.log("Datos no válidos:", ubicacionArticulo);
        }
    };

    // Abrir el diálogo para confirmar la eliminación de un ubicación artículo
    const confirmDeleteUbicacionArticulo = (ubicacionArticulo) => {
        setUbicacionArticulo(ubicacionArticulo);
        setDeleteProductsDialog(true);
    };

    // Eliminar un ubicación artículo
    const deleteUbicacionArticulo = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/ubicacion-articulo/${ubicacionArticulo.id}`);
            fetchUbicacionArticulos();
            setDeleteProductsDialog(false);
            setUbicacionArticulo(null);
        } catch (error) {
            console.log("Error deleting ubicacion articulo:", error);
        }
    };

    // Renderizar el pie de página del diálogo de confirmación de eliminación
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteUbicacionArticulo} />
        </React.Fragment>
    );

    // Renderizar el componente
    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Ubicaciones de Artículos</h1>
                <Button label="Nueva Ubicación" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />

                <DataTable value={ubicacionArticulos} className="p-datatable-sm">
                    <Column field="estante.ubicacion.direccion" header="Direccion"></Column>
                    <Column field="articulo.nombre" header="Articulo"></Column>
                    <Column field="fila" header="Fila del estante"></Column>
                    <Column field="cant_articulo" header="Cantidad"></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editUbicacionArticulo(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteUbicacionArticulo(rowData)} />
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${ubicacionArticulo ? 'Editar' : 'Nuevo'} UbicacionArticulo`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="tipo-ubicacion" className="font-weight-bold">Ubicación</label>
                        <Dropdown
                            id="tipo-ubicacion"
                            value={ubicacionArticulo?.estante_id || null}
                            options={estantes.map(estante => ({
                                label: `Estante ID: ${estante.id}, Dirección: ${estante.ubicacion.direccion}, Filas: ${estante.cant_fila}`,
                                value: estante.id
                            }))}
                            onChange={(e) => onInputChange(e, 'estante_id')}
                            optionLabel="label"
                            placeholder="Seleccione un estante"
                            className="form-control"
                        />
                        {submitted && !ubicacionArticulo?.estante_id && <small className="p-error">El tipo de ubicación es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="tipo-ubicacion" className="font-weight-bold">Articulo</label>
                        <Dropdown
                            id="tipo-ubicacion"
                            value={ubicacionArticulo?.articulo_id || null}
                            options={articulos.map(articulo => ({ label: articulo.nombre, value: articulo.id }))}
                            onChange={(e) => onInputChange(e, 'articulo_id')}
                            optionLabel="label"
                            placeholder="Seleccione un tipo de ubicación"
                            className="form-control"
                        />
                        {submitted && !ubicacionArticulo?.articulo_id && <small className="p-error">El tipo de ubicación es requerido.</small>}
                    </div>
                    
                    <div className="p-field">
                        <label htmlFor="fila" className="font-weight-bold">Fila</label>
                        <InputText id="fila" value={ubicacionArticulo?.fila || ''} onChange={(e) => onInputChange(e, 'fila')} required className="form-control" />
                        {submitted && !ubicacionArticulo?.fila && <small className="p-error">La fila es requerida.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="cant_articulo" className="font-weight-bold">Cantidad Artículo</label>
                        <InputText id="cant_articulo" value={ubicacionArticulo?.cant_articulo || ''} onChange={(e) => onInputChange(e, 'cant_articulo')} required className="form-control" />
                        {submitted && !ubicacionArticulo?.cant_articulo && <small className="p-error">La cantidad es requerida.</small>}
                    </div>

                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveUbicacionArticulo} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {ubicacionArticulo && (
                            <span>¿Seguro que quieres eliminar la ubicación del artículo <b>{ubicacionArticulo.nombre}</b>?</span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default UbicacionArticulos;
