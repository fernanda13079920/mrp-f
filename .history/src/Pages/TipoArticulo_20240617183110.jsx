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

const TipoArticulos = () => {
    const [tipoArticulos, setTipoArticulos] = useState([]);
    const [tipoArticulo, setTipoArticulo] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Función para obtener la lista de tipos de ubicaciones
    const fetchTipoArticulos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/tipo-articulo");
            setTipoArticulos(response.data.data);
        } catch (error) {
            console.error("Error fetching tipo articulos:", error);
        }
    };

    // Cargar la lista de tipos de ubicaciones al cargar el componente
    useEffect(() => {
        fetchTipoArticulos();
    }, []);

    // Manejar cambios en los inputs del formulario
    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedTipoArticulo = { ...tipoArticulo, [name]: val };
        setTipoArticulo(updatedTipoArticulo);
    };

    // Abrir el diálogo para agregar/editar tipo de ubicación
    const openNew = () => {
        setTipoArticulo({ id: null, nombre: '' });
        setProductDialog(true);
    };

    // Cerrar el diálogo de formulario
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    // Guardar un nuevo tipo de ubicación o actualizar uno existente
    const saveTipoArticulo = async () => {
        setSubmitted(true);

        if ( tipoArticulo.nombre && tipoArticulo.nombre.trim()) {
            try {
                if (tipoArticulo.id) {
                    await axios.put(`http://127.0.0.1:8000/api/tipo-articulo/${tipoArticulo.id}`, tipoArticulo);
                } else {
                    await axios.post(`http://127.0.0.1:8000/api/tipo-articulo`, tipoArticulo);
                }
                setProductDialog(false);
                setTipoArticulo(null);
                fetchTipoArticulos();
            } catch (error) {
                console.log("Error saving tipo articulo:", error);
            }
        }
    };

    // Abrir el diálogo para editar un tipo de ubicación existente
    const editTipoArticulo = (tipoArticulo) => {
        setTipoArticulo(tipoArticulo);
        setProductDialog(true);
    };

    // Abrir el diálogo para confirmar la eliminación de un tipo de ubicación
    const confirmDeleteTipoUbicacion = (tipoArticulo) => {
        setTipoArticulo(tipoArticulo);
        setDeleteProductsDialog(true);
    };

    // Eliminar un tipo de ubicación
    const deleteTipoArticulo = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tipo-articulo/${tipoArticulo.id}`);
            fetchTipoArticulos();
            setDeleteProductsDialog(false);
            setTipoArticulo(null);
        } catch (error) {
            console.log("Error deleting tipo articulo:", error);
        }
    };

    // Renderizar el pie de página del diálogo de confirmación de eliminación
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteTipoUbicacion} />
        </React.Fragment>
    );

    // Renderizar el componente
    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Tipos de Articulos</h1>
                <Button label="Nuevo Tipo de Ubicación" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />

                <DataTable value={tipoArticulo} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre"></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editTipoArticulo(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteTipoArticulo(rowData)} />
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${tipoUbicacion ? 'Editar' : 'Nuevo'} Tipo de Ubicación`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <InputText id="nombre" value={tipoArticulo?.nombre || ''} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className="form-control" />
                        {submitted && !tipoArticulo?.nombre && <small className="p-error">El nombre es requerido.</small>}
                    </div>
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveTipoA} />
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

export default TipoArticulos;
