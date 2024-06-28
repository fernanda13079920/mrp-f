import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos base de PrimeReact
import 'primeflex/primeflex.css'; // Estilos de PrimeFlex para alineación y disposición
import { format } from "date-fns";
import { AuthContext } from '../context/authContext';
const PERMISOS = {
    CREATE: 14,
    EDIT: 15,
    DELETE: 16
};
const MateriasPrimas = () => {
    const { authData } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState(null);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const tipoId = 1; // ID del tipo de producto que quieres filtrar

    // Función para obtener la lista de productos filtrados por tipoId
    const fetchProductos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allProductos = response.data.data;
            const filteredProductos = allProductos.filter(producto => producto.tipo_id === tipoId);
            setProductos(filteredProductos);
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };

    // Cargar la lista de productos al cargar el componente
    useEffect(() => {
        fetchProductos();
    }, []);

    const [tipoArticulos, setTipoArticulos] = useState([]);

    // Función para obtener la lista de tipos de ubicaciones
    const fetchTipoArticulos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/tipo-articulo");
            setTipoArticulos(response.data.data);
        } catch (error) {
            console.error("Error fetching tipo ubicaciones:", error);
        }
    };

    // Cargar la lista de tipos de ubicaciones al cargar el componente
    useEffect(() => {
        fetchTipoArticulos();
    }, []);
    // Manejar cambios en los inputs del formulario
    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedProducto = { ...producto, [name]: val };
        setProducto(updatedProducto);
    };

    // Abrir el diálogo para agregar/editar tipo de producto
    const openNew = () => {
        setProducto({ id: null, tipo: '', nombre: '', descripcion: '', fecha_creacion: '', fecha_vencimiento: '', serie: '', cantidad: null, imagen: null });
        setProductDialog(true);
    };

    // Cerrar el diálogo de formulario
    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    // Guardar un nuevo producto o actualizar uno existente
    const saveProducto = async () => {
        setSubmitted(true);
        const date = new Date(producto.fecha_creacion);
        const dateVenc = new Date(producto.fecha_vencimiento);

        const formattedDatecraete = format(date, 'yyyy-MM-dd');
        const formattedDateVenci = format(dateVenc, 'yyyy-MM-dd');
        producto.fecha_creacion = formattedDatecraete;
        producto.fecha_vencimiento = formattedDateVenci;

        // console.log(producto);

        if (producto.tipo_id && producto.nombre && producto.descripcion && producto.fecha_creacion && producto.fecha_vencimiento && producto.serie && producto.serie.trim()) {
            try {
                if (producto.id) {
                    await axios.put(`http://3.147.242.40/api/articulo/${producto.id}`, producto);
                } else {
                    const a = await axios.post(`http://3.147.242.40/api/articulo`, producto);
                    console.log(a);
                }
                setProductDialog(false);
                setProducto(null);
                fetchProductos();
            } catch (error) {
                console.log("Error saving producto:", error);
            }
        } else {
            console.log("Ubicación o cantidad de filas no válidos:", producto);
        }
    };

    // Abrir el diálogo para editar un producto existente
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

    // Abrir el diálogo para confirmar la eliminación de un producto
    const confirmDeleteProducto = (producto) => {
        setProducto(producto);
        setDeleteProductsDialog(true);
    };

    // Eliminar un producto
    const deleteProducto = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/articulo/${producto.id}`);
            fetchProductos();
            setDeleteProductsDialog(false);
            setProducto(null);
        } catch (error) {
            console.log("Error deleting producto:", error);
        }
    };

    // Renderizar el pie de página del diálogo de confirmación de eliminación
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
                <h1 className="text-primary mb-4">Listado de Materia Prima </h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nuevo Producto" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}
                <div className="p-field">
                    <label htmlFor="filtroGlobal" className="font-weight-bold">Buscar</label>
                    <InputText id="filtroGlobal" value={filtroGlobal} onChange={onFiltroGlobalChange} className="form-control mb-4" />
                </div>
                <DataTable value={filterGlobal(productos)} className="p-datatable-sm">
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="descripcion" header="Descripcion" sortable></Column>
                    <Column field="fecha_creacion" header="Creacion" sortable></Column>
                    <Column field="fecha_vencimiento" header="Vencimiento" sortable></Column>
                    <Column field="serie" header="Serie" sortable></Column>
                    <Column field="cantidad" header="Cantidad" sortable></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-mr-2" onClick={() => editProducto(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteProducto(rowData)} />
                            )}
                        </div>
                    )} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '30rem', paddingBottom: '0' }} header={`${producto ? 'Editar' : 'Nuevo'} Producto`} modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="tipo-articulo" className="font-weight-bold">Tipo</label>                        <Dropdown
                            id="tipo-articulo"
                            value={producto?.tipo_id || null}
                            options={tipoArticulos.map(tipo => ({ label: tipo.nombre, value: tipo.id }))}
                            onChange={(e) => onInputChange(e, 'tipo_id')}
                            optionLabel="label"
                            placeholder="Seleccione un tipo"
                            className="p-inputtext"
                        />
                        {submitted && !producto?.tipo_id && <small className="p-error">El tipo es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
                        <InputText id="nombre" value={producto?.nombre || ''} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className="form-control" />
                        {submitted && !producto?.nombre && <small className="p-error">La cantidad de filas es requerida.</small>}
                    </div>

                    <div className="p-field">
                        <label htmlFor="descripcion" className="font-weight-bold">Descripcion</label>
                        <InputText id="descripcion" value={producto?.descripcion || ''} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className="form-control" />
                        {submitted && !producto?.descripcion && <small className="p-error">La cantidad de filas es requerida.</small>}
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
                        {submitted && !producto?.serie && <small className="p-error">La cantidad de filas es requerida.</small>}
                    </div>
                    <div className="p-d-flex p-jc-end mt-4">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-text p-button-outlined p-button-secondary" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button p-button-primary p-button-outlined p-ml-2" onClick={saveProducto} />
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '30rem' }} header="Confirmación" modal footer={deleteProductsDialogFooter} onHide={() => setDeleteProductsDialog(false)}>
                    <div className="p-d-flex p-ai-center p-p-3">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'var(--danger-color)' }} />
                        {producto && (
                            <span>¿Seguro que quieres eliminar el producto ubicado en <b>{producto.tipo.direccion}</b>?</span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default MateriasPrimas;
