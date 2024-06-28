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
    CREATE: 46,
    EDIT: 47,
    DELETE: 48
};

const Proveedores = () => {
    const { authData } = useContext(AuthContext);
    const [proveedores, setProveedores] = useState([]);
    const [proveedor, setProveedor] = useState({ articulos_id: [] });
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [articulos, setArticulos] = useState([]);
    const [verDialog, setVerDialog] = useState(false);

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

    const tipoId = 1;

    // Función para obtener productos filtrados por tipo
    const fetchArticulos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allArticulos = response.data.data;
            const filteredArticulos = allArticulos.filter(articulo => articulo.tipo_id === tipoId);
            setArticulos(filteredArticulos.map(a => ({ label: a.nombre, value: a.id })));
        } catch (error) {
            console.error("Error al obtener articulos:", error);
        }
    };

    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedProveedor = { ...proveedor, [name]: val };
        setProveedor(updatedProveedor);
    };

    const openNew = () => {
        setProveedor({ id: null, nombre: '', apellido: '', celular: '', empresa: '', articulos_id: [] });
        setSubmitted(false);
        setProductDialog(true);
    };

    const onArticuloChange = (e) => {
        const selectedArticuloIds = e.value;
        setProveedor(prevProveedor => ({ ...prevProveedor, articulos_id: selectedArticuloIds }));
    };

    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    const saveProveedor = async () => {
        setSubmitted(true);

        if (proveedor.nombre && proveedor.apellido && proveedor.celular && proveedor.empresa && proveedor.articulos_id.length) {
            try {
                if (proveedor.id) {
                    await axios.put(`http://3.147.242.40/api/proveedor/${proveedor.id}`, proveedor);
                } else {
                    await axios.post(`http://3.147.242.40/api/proveedor`, proveedor);
                }
                setProductDialog(false);
                fetchProveedores();
                setProveedor({ id: null, nombre: '', apellido: '', celular: '', empresa: '', articulos_id: [] });
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

    const verArticulos = (proveedor) => {
        setProveedor(proveedor);
        setVerDialog(true);
    };

    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteProveedor} />
        </React.Fragment>
    );
    const articulosMap = articulos.reduce((acc, articulo) => {
        acc[articulo.value] = articulo.label;
        return acc;
    }, {});
    const [filtroGlobal, setFiltroGlobal] = useState('');

    const onFiltroGlobalChange = (e) => {
        setFiltroGlobal(e.target.value);
    };

    const filterGlobal = (proveedores) => {
        return proveedores.filter(proveedor =>
            proveedor.nombre.toLowerCase().includes(filtroGlobal.toLowerCase()) ||
            proveedor.apellido.toLowerCase().includes(filtroGlobal.toLowerCase()) ||
            proveedor.empresa.toLowerCase().includes(filtroGlobal.toLowerCase())
        );
    };

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Proveedores</h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nuevo Proveedor" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}
                <div className="p-field">
                    <label htmlFor="filtroGlobal" className="font-weight-bold">Buscar</label>
                    <InputText id="filtroGlobal" value={filtroGlobal} onChange={onFiltroGlobalChange} className="form-control mb-4" />
                </div>
                <DataTable value={filterGlobal(proveedores)} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="apellido" header="Apellido" sortable></Column>
                    <Column field="celular" header="Celular" sortable></Column>
                    <Column field="empresa" header="Empresa" sortable></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button className="p-button-rounded p-button-outlined p-button-success p-button-sm p-m-2" onClick={() => verArticulos(rowData)} label="Articulos" />
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editProveedor(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteProveedor(rowData)} />
                            )}
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

                    <div className="p-field">
                        <label htmlFor="articulos" className="font-weight-bold">Articulos</label>
                        <MultiSelect
                            id="articulos"
                            value={proveedor.articulos_id || []}
                            options={articulos}
                            onChange={onArticuloChange}
                            placeholder="Seleccionar artículos"
                            className="form-control"
                        />
                        {submitted && !proveedor?.articulos_id?.length && <small className="p-error">Debe seleccionar al menos un artículo.</small>}
                    </div>

                    <div className="p-dialog-footer">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button-primary" onClick={saveProveedor} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="confirmation-content d-flex align-items-center justify-content-center flex-column">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: 'var(--orange)' }} />
                        {proveedor && <span>¿Está seguro de que desea eliminar el proveedor <b>{proveedor.nombre}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={verDialog} style={{ width: '600px' }} header="Artículos del Proveedor" modal className="p-fluid" onHide={() => setVerDialog(false)}>
                    <div>
                        <h5>Proveedor: {proveedor?.nombre} {proveedor?.apellido}</h5>
                        <ul>
                            {proveedor?.articulos_id?.map(articuloId => (
                                <li key={articuloId}>{articulosMap[articuloId]}</li>
                            ))}
                        </ul>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Proveedores;
