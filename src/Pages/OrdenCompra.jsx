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

const Compra = () => {
    const { authData } = useContext(AuthContext);
    const [compras, setCompras] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [compra, setCompra] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [productDialog, setProductDialog] = useState(false);

    const fetchCompras = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/orden-compra");
            setCompras(response.data.data);
        } catch (error) {
            console.error("Error fetching compras:", error);
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
        fetchCompras();
        fetchUsuarios();
        fetchProveedores();
        fetchProductos();
    }, []);

    const openNew = () => {
        setCompra({ usuario_id_ge: authData.id, usuario_id_ges: null, proveedor_id: null, productos: [] });
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProductDialog(false);
        setSubmitted(false);
    };

    const onInputChange = (e, name) => {
        const val = e.target.value;
        let updatedCompra = { ...compra, [name]: val };
        setCompra(updatedCompra);
    };

    const onProductoChange = (e) => {
        const selectedProductos = e.value;
        const updatedProductos = selectedProductos.map(productoId => {
            const existingProducto = compra?.productos.find(producto => producto.id === productoId);
            return existingProducto || { id: productoId, cantidad: 1 };
        });
        setCompra({ ...compra, productos: updatedProductos });
    };

    // Función para manejar cambios en la cantidad de materiales
    const onProductoQuantityChange = (e, productoId) => {
        const cantidad = e.target.value;
        const updatedProductos = compra.productos.map(producto =>
            producto.id === productoId ? { ...producto, cantidad: cantidad } : producto
        );
        setCompra({ ...compra, productos: updatedProductos });
    };

    const saveCompra = async () => {
        setSubmitted(true);
    
        if (compra.usuario_id_ges && compra.productos.length > 0) {
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
                doc.text(`gestionador: ${usuarios.find(u => u.id === compra.usuario_id_ges)?.username || ''}`, 20, 40);
                doc.text(`Fecha y Hora: ${new Date().toLocaleString()}`, 20, 50);
    
                // Agregar una línea
                doc.setLineWidth(0.5);
                doc.line(20, 55, 190, 55);
    
                // Crear la tabla de productos
                const tableColumn = ["Producto", "Cantidad"];
                const tableRows = compra.productos.map(producto => {
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
                doc.save('compra.pdf');
                // Generar el Blob del PDF
                const pdfBlob = doc.output('blob');
    
                // Convertir Blob a File
                const pdfFile = new File([pdfBlob], 'compra.pdf', { type: 'application/pdf' });
    
                // Construir FormData
                const formData = new FormData();
                formData.append('pdf_data', pdfFile);
                formData.append('usuario_id_ge', compra.usuario_id_ge);
                formData.append('usuario_id_ges', compra.usuario_id_tr);
                formData.append('proveedor_id', compra.proveedor_id);
                formData.append('estado_compra_id', 1); // Asumiendo que el estado de producción es fijo en 1
                formData.append('fecha_hora', new Date().toISOString().slice(0, 19).replace('T', ' ')); // Formato de fecha requerido
    
                // Verificar FormData
                formData.forEach((value, key) => {
                    console.log(`${key}: ${value}`);
                });
                
                console.log(formData);
                // Enviar la solicitud
                const response = await axios.post(`http://3.147.242.40/api/orden-compra`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                // const response = await axios.post(`http://127.0.0.1:8000/api/orden-compra`, formData, {
                //     // headers: {
                //     //     'Content-Type': 'multipart/form-data'
                //     // }
                // });
                console.log('Response:', response);
    
                // setProductDialog(false);
                // setCompra(null);
                // fetchCompras();
            } catch (error) {
                console.log("Error saving compra:", error);
            }
        }
    };
    

    const editCompra = (compra) => {
        setCompra(compra);
        setProductDialog(true);
    };

    const confirmDeleteCompra = (compra) => {
        setCompra(compra);
    };

    const deleteCompra = async () => {
        try {
            await axios.delete(`http://3.147.242.40/api/compra/${compra.id}`);
            fetchCompras();
            setCompra(null);
        } catch (error) {
            console.log("Error deleting compra:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Órdenes de Producción</h1>
                <Button label="Nueva Producción" icon="pi pi-plus" className="p-button-success mb-4" onClick={openNew} />
                <DataTable value={compras} className="p-datatable-sm">
                    <Column field="id" header="ID"></Column>
                    <Column field="usuario_generado.username" header="Usuario Generado"></Column>
                    <Column field="usuario_trabajador.username" header="Usuario Trabajador"></Column>
                    <Column field="estado_compra.descripcion" header="Estado Producción"></Column>
                    <Column body={(rowData) => (
                        <Button label="Abrir PDF" icon="pi pi-file-pdf" className="p-button-rounded p-button-outlined p-button-danger p-m-2" onClick={
                            () => {
                                // console.log(rowData.pdf_data);
                                window.open(rowData.pdf_data, '_blank')
                                // window.open(rowData.pdf_url, '_blank')
                            }
                        } />
                    )}></Column>
                    <Column body={(rowData) => (
                        <div className="p-d-flex p-jc-center">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-button-sm p-m-2" onClick={() => editCompra(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-button-sm" onClick={() => confirmDeleteCompra(rowData)} />
                        </div>
                    )}></Column>
                </DataTable>

                <Dialog visible={productDialog} style={{ width: '50vw' }} header="Orden de Producción" modal className="p-fluid" onHide={hideDialog}>
                    <div className="p-field">
                        <label htmlFor="usuario_id_ges">Asignar a Gestionador</label>
                        <Dropdown id="usuario_id_ges" value={compra?.usuario_id_ges || ''} options={usuarios.map(u => ({ label: u.username, value: u.id }))} onChange={(e) => onInputChange(e, 'usuario_id_ges')} placeholder="Seleccione un gestionador" />
                        {submitted && !compra?.usuario_id_ges && <small className="p-error">El gestionador es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="proveedor_id">Asignar a proveedor</label>
                        <Dropdown id="proveedor_id" value={compra?.proveedor || ''} options={proveedores.map(p => ({ label: p.nombre, value: p.id }))} onChange={(e) => onInputChange(e, 'proveedor_id')} placeholder="Seleccione un proveedor" />
                        {submitted && !compra?.proveedor_id && <small className="p-error">El proveedor es requerido.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="productos">Agregar Producto</label>
                        <MultiSelect
                            id="productos"
                            value={compra?.productos.map(p => p.id) || []}
                            options={productos.map(p => ({ label: p.nombre, value: p.id }))}
                            onChange={onProductoChange}
                            optionLabel="label"
                            placeholder="Seleccione materias primas"
                            className="form-control"
                            display="chip"
                        />
                        {submitted && (!compra?.productos || compra.productos.length === 0) && (
                            <small className="p-error">Las materias primas son requeridas.</small>
                        )}
                    </div>

                    {/* Renderizar la cantidad de cada material */}
                    {compra?.productos.map(producto => {
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
                        <Button label="Guardar" icon="pi pi-check" className="p-button-success p-ml-2" onClick={saveCompra} />
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Compra;
