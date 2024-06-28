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
    const [proveedor, setProveedor] = useState({ id: null, nombre: '', apellido: '', celular: '', empresa: '', lista_materiales: [] });
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
        setProveedor({ id: null, nombre: '', apellido: '', celular: '', empresa: '', lista_materiales: [] });
        setSubmitted(false);
        setProductDialog(true);
    };

    const onArticuloChange = (e) => {
        const selectedArticuloIds = e.value;
        setProveedor(prevProveedor => ({ ...prevProveedor, lista_materiales: selectedArticuloIds }));
    };

    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    const saveProveedor = async () => {
        setSubmitted(true);

        if (proveedor.nombre && proveedor.apellido && proveedor.celular && proveedor.empresa && proveedor.lista_materiales.length) {
            try {
                if (proveedor.id) {
                    await axios.put(`http://3.147.242.40/api/proveedor/${proveedor.id}`, proveedor);
                } else {
                    await axios.post(`http://3.147.242.40/api/proveedor`, proveedor);
                }
                setProductDialog(false);
                fetchProveedores();
                setProveedor({ id: null, nombre: '', apellido: '', celular: '', empresa: '', lista_materiales: [] });
            } catch (error) {
                console.log("Error saving proveedor:", error);
            }
        }
    };

    const editProveedor = (proveedor) => {
        setProveedor({
            ...proveedor,
            lista_materiales: proveedor.lista_materiales || []
        });
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
            setProveedor({ id: null, nombre: '', apellido: '', celular: '', empresa: '', lista_materiales: [] });
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

    // Añadir logs para depuración
    useEffect(() => {
        console.log("Proveedor:", proveedor);
        console.log("Articulos Map:", articulosMap);
    }, [proveedor, articulosMap]);

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
                                <Button className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-m-2" onClick={() => editProveedor(rowData)} icon="pi pi-pencil" />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button className="p-button-rounded p-button-outlined p-button-danger p-button-sm p-m-2" onClick={() => confirmDeleteProveedor(rowData)} icon="pi pi-trash" />
                            )}
                        </div>
                    )}></Column>
                </DataTable>
            </div>
            <Dialog visible={productDialog} style={{ width: '450px' }} header="Proveedor" modal className="p-fluid" footer={
                <React.Fragment>
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={hideDialog} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-outlined p-button-primary" onClick={saveProveedor} />
                </React.Fragment>
            } onHide={hideDialog}>
                <div className="p-field">
                    <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                    <InputText id="nombre" value={proveedor?.nombre} onChange={(e) => onInputChange(e, 'nombre')} className={submitted && !proveedor?.nombre ? 'p-invalid' : ''} />
                    {submitted && !proveedor?.nombre && <small className="p-error">El nombre es obligatorio.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="apellido" className="font-weight-bold">Apellido</label>
                    <InputText id="apellido" value={proveedor?.apellido} onChange={(e) => onInputChange(e, 'apellido')} className={submitted && !proveedor?.apellido ? 'p-invalid' : ''} />
                    {submitted && !proveedor?.apellido && <small className="p-error">El apellido es obligatorio.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="celular" className="font-weight-bold">Celular</label>
                    <InputText id="celular" value={proveedor?.celular} onChange={(e) => onInputChange(e, 'celular')} className={submitted && !proveedor?.celular ? 'p-invalid' : ''} />
                    {submitted && !proveedor?.celular && <small className="p-error">El celular es obligatorio.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="empresa" className="font-weight-bold">Empresa</label>
                    <InputText id="empresa" value={proveedor?.empresa} onChange={(e) => onInputChange(e, 'empresa')} className={submitted && !proveedor?.empresa ? 'p-invalid' : ''} />
                    {submitted && !proveedor?.empresa && <small className="p-error">La empresa es obligatoria.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="articulos" className="font-weight-bold">Artículos</label>
                    <MultiSelect id="articulos" value={proveedor?.lista_materiales || []} options={articulos} onChange={onArticuloChange} placeholder="Seleccionar artículos" className="form-control" />
                    {submitted && !(proveedor?.lista_materiales?.length) && <small className="p-error">Debe seleccionar al menos un artículo.</small>}
                </div>
            </Dialog>
            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {proveedor && <span>¿Estás seguro de que deseas eliminar <b>{proveedor.nombre}</b>?</span>}
                </div>
            </Dialog>
            <Dialog visible={verDialog} style={{ width: '450px' }} header="Artículos del Proveedor" modal className="p-fluid" footer={
                <React.Fragment>
                    <Button label="Cerrar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setVerDialog(false)} />
                </React.Fragment>
            } onHide={() => setVerDialog(false)}>
                <div className="p-field">
                    <label htmlFor="articulos" className="font-weight-bold">Artículos</label>
                    <ul>
                        {proveedor?.lista_materiales?.map(id => (
                            <li key={id}>{articulosMap[id]}</li>
                        ))}
                    </ul>
                </div>
            </Dialog>
        </div>
    );
};

export default Proveedores;
