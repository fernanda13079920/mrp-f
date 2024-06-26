import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos base de PrimeReact
import 'primeflex/primeflex.css'; // Estilos de PrimeFlex para alineación y disposición

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedor, setProveedor] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [articulos, setArticulos] = useState([]);
    const [articulosDialog, setArticulosDialog] = useState(false);

    useEffect(() => {
        fetchProveedores();
        fetchArticulos();
    }, []);

    const fetchProveedores = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/proveedor");
            setProveedores(response.data.data);
        } catch (error) {
            console.error("Error fetching proveedores:", error);
        }
    };

    const fetchArticulos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            setArticulos(response.data.data);
        } catch (error) {
            console.error("Error fetching articulos:", error);
        }
    };

    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedProveedor = { ...proveedor, [name]: val };
        setProveedor(updatedProveedor);
    };

    const openNew = () => {
        setProveedor({ id: null, nombre: '', apellido: '', celular: '', empresa: '', articulos_id: [] });
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    const saveProveedor = async () => {
        setSubmitted(true);

        if (proveedor.nombre && proveedor.apellido && proveedor.empresa) {
            try {
                if (proveedor.id) {
                    await axios.put(`http://3.147.242.40/api/proveedor/${proveedor.id}`, proveedor);
                } else {
                    await axios.post(`http://3.147.242.40/api/proveedor`, proveedor);
                }
                setProductDialog(false);
                setProveedor(null);
                fetchProveedores();
            } catch (error) {
                console.log("Error saving proveedor:", error);
            }
        }
    };

    const editProveedor = (proveedor) => {
        setProveedor(proveedor);
        setProductDialog(true);
    };

    const confirmDeleteProveedor = (proveedor) => {
        setProveedor(proveedor);
        setDeleteProductsDialog(true);
    };

    const deleteProveedor = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/proveedor/${proveedor.id}`);
            fetchProveedores();
            setDeleteProductsDialog(false);
            setProveedor(null);
        } catch (error) {
            console.log("Error deleting proveedor:", error);
        }
    };

    const showArticulos = (proveedor) => {
        setProveedor(proveedor);
        setArticulosDialog(true);
    };

    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteProveedor} />
        </React.Fragment>
    );

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Proveedores</h1>
                <Button label="Nuevo Proveedor" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />

                <DataTable value={proveedores} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="apellido" header="Apellido"></Column>
                    <Column field="celular" header="Celular"></Column>
                    <Column field="empresa" header="Empresa"></Column>
                    <Column header="Articulos">
                        <template>{rowData => (
                            <>
                                {rowData.articulos_id.map(articuloId => {
                                    const articulo = articulos.find(a => a.id === articuloId);
                                    return articulo ? <Chip key={articulo.id} label={articulo.nombre} className="p-mr-2 p-mb-2" /> : null;
                                })}
                            </>
                        )}</template>
                    </Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editProveedor(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteProveedor(rowData)} />
                        </div>
                    )} style={{ textAlign: 'center', width: '12em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${proveedor ? 'Editar' : 'Nuevo'} Proveedor`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <InputText id="nombre" value={proveedor?.nombre || ''} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className="form-control" />
                        {submitted && !proveedor?.nombre && <small className="p-error">El nombre es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="apellido" className="font-weight-bold">Apellido</label>
                        <InputText id="apellido" value={proveedor?.apellido || ''} onChange={(e) => onInputChange(e, 'apellido')} required autoFocus className="form-control" />
                        {submitted && !proveedor?.apellido && <small className="p-error">El apellido es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="celular" className="font-weight-bold">Celular</label>
                        <InputText id="celular" value={proveedor?.celular || ''} onChange={(e) => onInputChange(e, 'celular')} required autoFocus className="form-control" />
                        {submitted && !proveedor?.celular && <small className="p-error">El celular es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="empresa" className="font-weight-bold">Empresa</label>
                        <InputText id="empresa" value={proveedor?.empresa || ''} onChange={(e) => onInputChange(e, 'empresa')} required autoFocus className="form-control" />
                        {submitted && !proveedor?.empresa && <small className="p-error">La empresa es requerida.</small>}
                    </div>
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveProveedor} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {proveedor && (
                            <span>¿Seguro que quieres eliminar el proveedor <b>{proveedor.nombre} {proveedor.apellido}</b>?</span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={articulosDialog} style={{ width: '450px' }} header={`Articulos de ${proveedor ? proveedor.nombre + ' ' + proveedor.apellido : ''}`} modal onHide={() => setArticulosDialog(false)}>
                    <div className="p-d-flex p-jc-center p-flex-wrap">
                        {proveedor && proveedor.articulos_id.map(articuloId => {
                            const articulo = articulos.find(a => a.id === articuloId);
                            return articulo ? (
                                <div key={articulo.id} className="p-m-2">
                                    <Chip label={articulo.nombre} className="p-mr-2 p-mb-2" />
                                </div>
                            ) : null;
                        })}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Proveedores;

