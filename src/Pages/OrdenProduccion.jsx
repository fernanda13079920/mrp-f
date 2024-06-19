import React, { useState, useEffect } from 'react';
import { Button, Input, DatePicker, Table, InputNumber } from 'antd';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CrearOrdenProduccion = () => {
    const [usuarioIdGen, setUsuarioIdGen] = useState(1); // Id de usuario generador (deberías obtenerlo dinámicamente)
    const [usuarioIdTr, setUsuarioIdTr] = useState(null); // Id de usuario trabajador
    const [estadoProduccionId, setEstadoProduccionId] = useState(1); // Id del estado de producción
    const [fechaHora, setFechaHora] = useState(null); // Fecha y hora de la orden
    const [pdfUrl, setPdfUrl] = useState(''); // URL donde se guardará el PDF

    const [productos, setProductos] = useState([]); // Lista de productos disponibles
    const [productosSeleccionados, setProductosSeleccionados] = useState([]); // Productos seleccionados con cantidad

    useEffect(() => {
        // Simular carga de productos (debes obtenerlos de tu API)
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        // Aquí deberías hacer una solicitud a tu API para obtener la lista de productos
        // Ejemplo de lista simulada de productos
        const listaProductos = [
            { id: 1, nombre: 'Producto 1', cantidad: 0 },
            { id: 2, nombre: 'Producto 2', cantidad: 0 },
            { id: 3, nombre: 'Producto 3', cantidad: 0 },
            // Añade más productos según sea necesario
        ];
        setProductos(listaProductos);
    };

    const handleCrearOrden = async () => {
        // Validar datos y realizar acciones necesarias antes de generar el PDF
        if (!fechaHora || !pdfUrl) {
            alert('Debes ingresar la fecha/hora y la URL del PDF.');
            return;
        }

        // Generar el contenido HTML para el PDF (ejemplo básico)
        const contenidoHtml = `
            <div>
                <h2>Orden de Producción</h2>
                <p><strong>Usuario Generador:</strong> ${usuarioIdGen}</p>
                <p><strong>Usuario Trabajador:</strong> ${usuarioIdTr || 'N/A'}</p>
                <p><strong>Estado de Producción:</strong> ${estadoProduccionId}</p>
                <p><strong>Fecha y Hora:</strong> ${fechaHora.toLocaleString()}</p>
                <h3>Productos a Producir:</h3>
                <ul>
                    ${productosSeleccionados.map(producto => `<li>${producto.nombre}: ${producto.cantidad}</li>`).join('')}
                </ul>
            </div>
        `;

        // Convertir contenido HTML a PDF usando jsPDF y html2canvas
        const pdf = new jsPDF('p', 'mm', 'a4');
        const canvas = await html2canvas(document.getElementById('pdf-content'));

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
        pdf.save('orden_produccion.pdf');
    };

    const handleCantidadChange = (cantidad, productId) => {
        const productosActualizados = productosSeleccionados.map(producto =>
            producto.id === productId ? { ...producto, cantidad } : producto
        );
        setProductosSeleccionados(productosActualizados);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Nombre del Producto', dataIndex: 'nombre' },
        {
            title: 'Cantidad a Producir',
            render: (_, record) => (
                <InputNumber
                    min={0}
                    defaultValue={0}
                    value={productosSeleccionados.find(p => p.id === record.id)?.cantidad || 0}
                    onChange={(value) => handleCantidadChange(value, record.id)}
                />
            ),
        },
    ];

    return (
        <div>
            <h1>Crear Orden de Producción</h1>
            <label>Fecha y Hora:</label>
            <DatePicker
                showTime
                value={fechaHora}
                onChange={(date) => setFechaHora(date)}
                style={{ marginBottom: '1rem' }}
            />
            <label>URL del PDF (opcional):</label>
            <Input
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="Ingrese la URL donde se guardará el PDF"
                style={{ marginBottom: '1rem' }}
            />
            <Button type="primary" onClick={handleCrearOrden}>
                Generar PDF de Orden de Producción
            </Button>

            <h2>Seleccione los Productos a Producir:</h2>
            <Table columns={columns} dataSource={productos} rowKey="id" />
            
            <div id="pdf-content" style={{ display: 'none' }}>
                {/* Contenido HTML para el PDF */}
                <h2>Orden de Producción</h2>
                <p><strong>Usuario Generador:</strong> {usuarioIdGen}</p>
                <p><strong>Usuario Trabajador:</strong> {usuarioIdTr || 'N/A'}</p>
                <p><strong>Estado de Producción:</strong> {estadoProduccionId}</p>
                <p><strong>Fecha y Hora:</strong> {fechaHora?.toLocaleString()}</p>
                <h3>Productos a Producir:</h3>
                <ul>
                    {productosSeleccionados.map(producto => (
                        <li key={producto.id}>
                            {producto.nombre}: {producto.cantidad}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CrearOrdenProduccion;

