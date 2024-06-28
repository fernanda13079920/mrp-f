import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MultiSelect } from 'primereact/multiselect';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { AuthContext } from '../context/authContext';

const PERMISOS = {
    CREATE: 42,
    EDIT: 43,
    DELETE: 44
};

const Produccion = () => {
    const { authData } = useContext(AuthContext);
    const [producciones, setProducciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [produccion, setProduccion] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const fetchProducciones = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/orden-produccion");
            setProducciones(response.data.data);
        } catch (error) {
            console.error("Error fetching producciones:", error);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/usuario");
            setUsuarios(response.data.data);
        } catch (error) {
            console.error("Error fetching usuarios:", error);
        }
    };

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
        fetchProducciones();
        fetchUsuarios();
        fetchProductos();
    }, []);

    const openNew = () => {
        setProduccion({ usuario_id_ge: authData.id, usuario_id_tr: null, productos: [] });
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedProduccion = { ...produccion, [name]: val };
        setProduccion(updatedProduccion);
    };

    const onProductoChange = (e) => {
        const selectedProductos = e.value;
        const updatedProductos = selectedProductos.map(productoId => {
            const existingProducto = produccion?.productos.find(producto => producto.id === productoId);
            return existingProducto || { id: productoId, cantidad: 1 };
        });
        setProduccion({ ...produccion, productos: updatedProductos });
    };

    // Función para manejar cambios en la cantidad de materiales
    const onProductoQuantityChange = (e, productoId) => {
        const cantidad = e.target.value;
        const updatedProductos = produccion.productos.map(producto =>
            producto.id === productoId ? { ...producto, cantidad: cantidad } : producto
        );
        setProduccion({ ...produccion, productos: updatedProductos });
    };

    const saveProduccion = async () => {
        setSubmitted(true);

        if (produccion.usuario_id_tr && produccion.productos.length > 0) {
            try {
                const doc = new jsPDF();

                // Título
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text(`Orden de Producción`, 105, 20, null, null, 'center');

                // Subtítulos
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.text(`Generado por: ${authData.username}`, 20, 30);
                doc.text(`Trabajador: ${usuarios.find(u => u.id === produccion.usuario_id_tr)?.username || ''}`, 20, 40);
                doc.text(`Fecha y Hora: ${new Date().toLocaleString()}`, 20, 50);

                // Agregar una línea
                doc.setLineWidth(0.5);
                doc.line(20, 55, 190, 55);

                // Crear la tabla de productos
                const tableColumn = ["Producto", "Cantidad"];
                const tableRows = produccion.productos.map(producto => {
                    const productName = productos.find(p => p.id === producto.id)?.nombre || 'Desconocido';
                    return [productName, producto.cantidad.toString()];
                });

                // Agregar la tabla al documento
                doc.autoTable({
                    startY: 60,
                    head: [tableColumn],
                    body: tableRows,
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185] },
                    alternateRowStyles: { fillColor: [240, 240, 240] }
                });
                doc.save('produccion.pdf');
                // Generar el Blob del PDF
                const pdfBlob = doc.output('blob');

                // Convertir Blob a File
                const pdfFile = new File([pdfBlob], 'produccion.pdf', { type: 'application/pdf' });

                // Construir FormData
                const formData = new FormData();
                formData.append('pdf_data', pdfFile);
                formData.append('usuario_id_ge', produccion.usuario_id_ge);
                formData.append('usuario_id_tr', produccion.usuario_id_tr);
                formData.append('estado_produccion_id', 1); // Asumiendo que el estado de producción es fijo en 1
                formData.append('fecha_hora', new Date().toISOString().slice(0, 19).replace('T', ' ')); // Formato de fecha requerido

                // Verificar FormData
                formData.forEach((value, key) => {
                    console.log(`${key}: ${value}`);
                });

                console.log(formData);
                // Enviar la solicitud
                const response = await axios.post(`http://3.147.242.40/api/orden-produccion`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setProductDialog(false);
                setProduccion(null);
                fetchProducciones();
            } catch (error) {
                console.log("Error saving produccion:", error);
            }
        }
    };

    const editProduccion = (produccion) => {
        setProduccion(produccion);
        setProductDialog(true);
    };

    const confirmDeleteProduccion = (produccion) => {
        setProduccion(produccion);
        setDeleteDialog(true);
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const deleteProduccion = async () => {
        try {
            console.log(`Deleting produccion with ID: ${produccion.id}`);
            await axios.delete(`http://3.147.242.40/api/orden-produccion/${produccion.id}`);
            fetchProducciones();
            setProduccion(null);
            setDeleteDialog(false);
        } catch (error) {
            console.log("Error deleting produccion:", error);
        }
    };

    const [filtroGlobal, setFiltroGlobal] = useState('');

    const onFiltroGlobalChange = (e) => {
        setFiltroGlobal(e.target.value);
    };

    const filterGlobal = (producciones) => {
        return producciones.filter(produccion =>
            produccion.estado_produccion.descripcion.toLowerCase().includes(filtroGlobal.toLowerCase())
        );
    };


    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Órdenes de Producción</h1>
                {authData.permisos.includes(PERMISOS.CREATE) && (
                    <Button label="Nueva Producción" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                )}
                <div className="p-field">
                    <label htmlFor="filtroGlobal" className="font-weight-bold">Buscar</label>
                    <InputText id="filtroGlobal" value={filtroGlobal} onChange={onFiltroGlobalChange} className="form-control mb-4" />
                </div>
                <DataTable value={filterGlobal(producciones)} className="p-datatable-sm">
                    <Column field="usuario_generado.username" header="Usuario Generador" sortable></Column>
                    <Column field="usuario_trabajador.username" header="Usuario Trabajador" sortable></Column>
                    <Column field="estado_produccion.descripcion" header="Estado Producción" sortable></Column>
                    <Column body={(rowData) => (
                        <Button label="Abrir PDF" icon="pi pi-file-pdf" className="p-button-rounded p-button-outlined p-button-danger p-m-2" onClick={
                            () => {
                                window.open(rowData.pdf_data, '_blank');
                            }
                        } />
                    )}></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            {authData.permisos.includes(PERMISOS.EDIT) && (
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-m-2" onClick={() => editProduccion(rowData)} />
                            )}
                            {authData.permisos.includes(PERMISOS.DELETE) && (
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteProduccion(rowData)} />
                            )}
                        </div>
                    )}></Column>
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '50vw' }} header="Orden de Producción" modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="usuario_id_tr">Asignar a Trabajador</label>
                        <Dropdown id="usuario_id_tr" value={produccion?.usuario_id_tr || ''} options={usuarios.map(u => ({ label: u.username, value: u.id }))} onChange={(e) => onInputChange(e, 'usuario_id_tr')} placeholder="Seleccione un trabajador" />
                        {submitted && !produccion?.usuario_id_tr && <small className="p-error">El trabajador es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="productos">Agregar Producto</label>
                        <MultiSelect
                            id="productos"
                            value={produccion?.productos?.map(p => p.id) || []}
                            options={productos.map(p => ({ label: p.nombre, value: p.id }))}
                            onChange={onProductoChange}
                            optionLabel="label"
                            placeholder="Seleccione materias primas"
                            className="form-control"
                            display="chip"
                        />
                        {submitted && (!produccion?.productos || produccion.productos.length === 0) && (
                            <small className="p-error">Las materias primas son requeridas.</small>
                        )}
                    </div>

                    {/* Renderizar la cantidad de cada material */}
                    {produccion?.productos?.map(producto => {
                        const productName = productos.find(p => p.id === producto.id)?.nombre || 'Desconocido';
                        return (
                            <div className="p-field" key={producto.id}>
                                <label htmlFor={`cantidad-${producto.id}`} className="font-weight-bold">{productName} - Cantidad</label>
                                <InputText id={`cantidad-${producto.id}`} value={producto.cantidad} onChange={(e) => onProductoQuantityChange(e, producto.id)} type="number" min="1" className="form-control" />
                            </div>
                        );
                    })}
                    <div className="p-d-flex p-jc-end mt-5">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger p-ml-2" onClick={hideDialog} />
                        <Button label="Guardar" icon="pi pi-check" className="p-button-success p-ml-2" onClick={saveProduccion} />
                    </div>
                </Dialog>

                <Dialog visible={deleteDialog} style={{ width: '350px' }} header="Confirmar" modal footer={(
                    <div>
                        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
                        <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteProduccion} />
                    </div>
                )} onHide={hideDeleteDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
                        {produccion && <span>¿Estás seguro de que quieres eliminar?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Produccion;
