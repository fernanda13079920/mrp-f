import React, { useState, useEffect, useContext } from "react";
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
import { format } from 'date-fns';
import { AuthContext } from '../context/authContext';
const PERMISOS = {
    CREATE: 10,
    EDIT: 11,
    DELETE: 12
};
const Productos = () => {
    const { authData } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [verDialog, setVerDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const materia = 1;
    const tipoId = 2;

    // Función para obtener productos filtrados por tipo
    const fetchProductos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allProductos = response.data.data;
            const filteredProductos = allProductos.filter(producto => producto.tipo_id === tipoId);
            setProductos(filteredProductos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // Función para obtener materias primas filtradas por tipo
    const [materiasPrimas, setMateriasPrimas] = useState([]);

    const fetchMateriasPrimas = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allMateriasPrimas = response.data.data;
            const filteredMateriasPrimas = allMateriasPrimas.filter(producto => producto.tipo_id === materia);
            setMateriasPrimas(filteredMateriasPrimas);
        } catch (error) {
            console.error("Error al obtener materias primas:", error);
        }
    };

    useEffect(() => {
        fetchMateriasPrimas();
    }, []);

    // Función para obtener tipos de artículos
    const [tipoArticulos, setTipoArticulos] = useState([]);

    const fetchTipoArticulos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/tipo-articulo");
            setTipoArticulos(response.data.data);
        } catch (error) {
            console.error("Error al obtener tipos de artículos:", error);
        }
    };

    useEffect(() => {
        fetchTipoArticulos();
    }, []);

    // Función para manejar cambios en los campos del formulario
    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedProducto = { ...producto, [name]: val };
        setProducto(updatedProducto);
    };

    // Función para manejar cambios en los materiales seleccionados
    const onMaterialChange = (e) => {
        const selectedMaterials = e.value;
        const updatedMaterials = selectedMaterials.map(materialId => {
            const existingMaterial = producto?.materiales.find(material => material.id === materialId);
            return existingMaterial || { id: materialId, cantidad: 1, pivot: { cantidad: 1 } };
        });
        setProducto({ ...producto, materiales: updatedMaterials });
    };


    // Función para manejar cambios en la cantidad de materiales
    const onMaterialQuantityChange = (e, materialId) => {
        const cantidad = parseInt(e.target.value, 10);
        const updatedMaterials = producto.materiales.map(material =>
            material.id === materialId ?
                { ...material, pivot: { ...material.pivot, cantidad: cantidad } }
                : material
        );
        setProducto(prevProducto => ({
            ...prevProducto,
            materiales: updatedMaterials
        }));
    };



    // Función para abrir el formulario de nuevo producto
    const openNew = () => {
        setProducto({ id: null, tipo_id: '2', nombre: '', descripcion: '', fecha_creacion: null, fecha_vencimiento: null, serie: '', materiales: [] });
        setProductDialog(true);
    };

    // Función para cerrar el formulario
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    //formatear pivote
    const formatMaterials = (materials) => {
        return materials.map(material => ({
            id: material.id,
            cantidad: material.pivot.cantidad
            // cantidad: material.pivot ? material.pivot.cantidad : 0
        }));
    };


    // Función para guardar un producto
    const saveProducto = async () => {
        setSubmitted(true);

        const date = new Date(producto.fecha_creacion);
        const dateVenc = new Date(producto.fecha_vencimiento);

        const formattedDatecraete = format(date, 'yyyy-MM-dd');
        const formattedDateVenci = format(dateVenc, 'yyyy-MM-dd');
        producto.fecha_creacion = formattedDatecraete;
        producto.fecha_vencimiento = formattedDateVenci;
        const formattedMaterials = formatMaterials(producto.materiales);
        const copia = { ...producto, materiales: formattedMaterials };
        copia['imagen'] = '/ruta/imagen';

        if ( producto.nombre && producto.descripcion && producto.fecha_creacion && producto.fecha_vencimiento && producto.materiales.length && producto.serie.trim()) {
            try {
                if (producto.id) {
                    await axios.put(`http://3.147.242.40/api/articulo/${producto.id}`, copia);
                } else {
                    console.log(copia);
                    const a = await axios.post(`http://3.147.242.40/api/articulo`, copia);
                    console.log(a);

                }
                setProductDialog(false);
                setProducto(null);
                fetchProductos();
            } catch (error) {
                console.log("Error al guardar el producto:", error);
            }
        } else {
            console.log("Datos no válidos:", producto);
        }
    };

    // Función para editar un producto
    const editProducto = (producto) => {
        // Convertir las fechas de string a objetos Date si existen
        const fechaCreacion = producto.fecha_creacion ? new Date(producto.fecha_creacion) : null;
        const fechaVencimiento = producto.fecha_vencimiento ? new Date(producto.fecha_vencimiento) : null;

        // Actualizar el estado del producto con las fechas convertidas
        setProducto({
            ...producto,
            fecha_creacion: fechaCreacion,
            fecha_vencimiento: fechaVencimiento,
        });

        setProductDialog(true);
    };

    // Función para confirmar eliminación de un producto
    const confirmDeleteProducto = (producto) => {
        setProducto(producto);
        setDeleteProductsDialog(true);
    };

    // Función para eliminar un producto
    const deleteProducto = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/articulo/${producto.id}`);
            fetchProductos();
            setDeleteProductsDialog(false);
            setProducto(null);
        } catch (error) {
            console.log("Error al eliminar el producto:", error);
        }
    };

    // Función para ver los materiales de un producto
    const verMaterial = (producto) => {
        setProducto(producto);
        setVerDialog(true);
    };

    // Footer del Dialog de confirmación de eliminación de productos
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setDeleteProductsDialog(false)} />
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={deleteProducto} />
        </React.Fragment>
    );
    const [filtroGlobal, setFiltroGlobal] = useState('');

    const onFiltroGlobalChange = (e) => {
        setFiltroGlobal(e.target.value);
    };

    const filterGlobal = (productos) => {
        return productos.filter(producto =>
            producto.nombre.toLowerCase().includes(filtroGlobal.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(filtroGlobal.toLowerCase())
        );
    };
    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Listado de Productos</h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nuevo Producto" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}
                <div className="p-field">
                    <label htmlFor="filtroGlobal" className="font-weight-bold">Buscar</label>
                    <InputText id="filtroGlobal" value={filtroGlobal} onChange={onFiltroGlobalChange} className="form-control mb-4" />
                </div>
                <DataTable value={filterGlobal(productos)} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="descripcion" header="Descripción" sortable></Column>
                    <Column field="fecha_creacion" header="Creación" sortable></Column>
                    <Column field="fecha_vencimiento" header="Vencimiento" sortable></Column>
                    <Column field="serie" header="Serie" sortable></Column>
                    <Column field="cantidad" header="Cantidad" sortable></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button className="p-button-rounded p-button-outlined p-button-success p-button-sm p-mr-2" onClick={() => verMaterial(rowData)} label="Materiales" />
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editProducto(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteProducto(rowData)} />
                            )}
                        </div>
                    )} style={{ textAlign: 'center', width: '15em' }} />
                </DataTable>

                {/* Dialog para editar o crear un producto */}
                <Dialog visible={productDialog} style={{ width: '40rem', overflowY: 'auto', paddingBottom: '0' }} header={`${producto && producto.id? 'Editar' : 'Nuevo'} Producto`} modal className="p-fluid" onHide={hideDialog}>
                    

                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <InputText id="nombre" value={producto?.nombre || ''} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className="form-control" />
                        {submitted && !producto?.nombre && <small className="p-error">El nombre es requerido.</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="descripcion" className="font-weight-bold">Descripción</label>
                        <InputText id="descripcion" value={producto?.descripcion || ''} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className="form-control" />
                        {submitted && !producto?.descripcion && <small className="p-error">La descripción es requerida.</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="fecha_creacion" className="font-weight-bold">Fecha Creación</label>
                        <div className="p-inputgroup">
                            <Calendar id="fecha_creacion" value={producto?.fecha_creacion || null} onChange={(e) => onInputChange(e, 'fecha_creacion')} required showIcon className="p-inputtext" dateFormat="dd/mm/yy" />
                        </div>
                        {submitted && !producto?.fecha_creacion && <small className="p-error">La fecha de creación es requerida.</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="fecha_vencimiento" className="font-weight-bold">Fecha Vencimiento</label>
                        <div className="p-inputgroup">
                            <Calendar id="fecha_vencimiento" value={producto?.fecha_vencimiento || null} onChange={(e) => onInputChange(e, 'fecha_vencimiento')} required showIcon className="p-inputtext" dateFormat="dd/mm/yy" />
                        </div>
                        {submitted && !producto?.fecha_vencimiento && <small className="p-error">La fecha de vencimiento es requerida.</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="serie" className="font-weight-bold">Serie</label>
                        <InputText id="serie" value={producto?.serie || ''} onChange={(e) => onInputChange(e, 'serie')} required autoFocus className="form-control" />
                        {submitted && !producto?.serie && <small className="p-error">La serie es requerida.</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="materiasPrimas" className="font-weight-bold">Materias Primas</label>
                        <MultiSelect
                            id="materiasPrimas"
                            value={producto?.materiales.map(m => m.id) || []}
                            options={materiasPrimas.map(mp => ({ label: mp.nombre, value: mp.id }))}
                            onChange={onMaterialChange}
                            optionLabel="label"
                            placeholder="Seleccione materias primas"
                            className="form-control"
                            display="chip"
                        />
                        {submitted && (!producto?.materiales || producto.materiales.length === 0) && (
                            <small className="p-error">Las materias primas son requeridas.</small>
                        )}
                    </div>

                    {/* Renderizar la cantidad de cada material */}
                    {producto?.materiales.map(material => (
                        <div className="p-field" key={material.id}>
                            <label htmlFor={`pivot.cantidad-${material.id}`} className="font-weight-bold">{materiasPrimas.find(mp => mp.id === material.id)?.nombre} - Cantidad</label>
                            <InputText id={`pivot.cantidad-${material.id}`} value={material.pivot.cantidad} onChange={(e) => onMaterialQuantityChange(e, material.id)} type="number" min="1" className="form-control" />

                        </div>
                    ))}

                    {/* Botones de acción */}
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveProducto} />
                    </div>
                </Dialog>

                {/* Dialog para confirmar eliminación de productos */}
                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {producto && (
                            <span>¿Seguro que quieres eliminar el producto <b>{producto.nombre}</b>?</span>
                        )}
                    </div>
                </Dialog>

                {/* Dialog para ver materiales del producto */}
                <Dialog visible={verDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`Materiales del Producto - ${producto?.nombre}`} modal className="p-fluid" onHide={() => setVerDialog(false)} closable={true}>
                    <div className="p-field">
                        <label className="font-weight-bold">Materiales</label>
                        <DataTable value={producto?.materiales} className="p-datatable-sm">
                            <Column field="nombre" header="Nombre"></Column>
                            <Column field="pivot.cantidad" header="Cantidad"></Column>
                        </DataTable>
                    </div>
                </Dialog>

            </div>
        </div>
    );
};

export default Productos;

