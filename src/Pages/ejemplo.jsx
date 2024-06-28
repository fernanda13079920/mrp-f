import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';

const Ejecutivo = () => {
    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState([]);
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [rproductos, setRProductos] = useState([]);
    const [rmateriasPrimas, setRMateriasPrimas] = useState([]);
    const [crecienteProductos, setCrecienteProductos] = useState([]);
    const [crecienteMateriasPrimas, setCrecienteMateriasPrimas] = useState([]);
    const [minP, setMinP] = useState(10); // Valor mínimo de productos
    const [minM, setMinM] = useState(10); // Valor mínimo de materias primas
    const tipoId = 2; // Tipo de producto
    const materiaId = 1; // Tipo de materia prima

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchProductos(),
                fetchMateriasPrimas(),
                fetchRProductos(),
                fetchRMateriasPrimas(),
                fetchProductosCrecientes(),
                fetchMateriasPrimasCrecientes()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

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

    const fetchMateriasPrimas = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allMateriasPrimas = response.data.data;
            const filteredMateriasPrimas = allMateriasPrimas.filter(materia => materia.tipo_id === materiaId);
            setMateriasPrimas(filteredMateriasPrimas);
        } catch (error) {
            console.error("Error fetching materias primas:", error);
        }
    };

    const fetchRProductos = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allProductos = response.data.data;
            const filteredProductos = allProductos.filter(producto => producto.tipo_id === tipoId && producto.cantidad < minP);
            setRProductos(filteredProductos);
        } catch (error) {
            console.error("Error fetching rproductos:", error);
        }
    };

    const fetchRMateriasPrimas = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allMateriasPrimas = response.data.data;
            const filteredMateriasPrimas = allMateriasPrimas.filter(materia => materia.tipo_id === materiaId && materia.cantidad < minM);
            setRMateriasPrimas(filteredMateriasPrimas);
        } catch (error) {
            console.error("Error fetching rmateriasPrimas:", error);
        }
    };

    const fetchProductosCrecientes = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allProductos = response.data.data;
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - 7); // Productos creados hace una semana
            const filteredCrecienteProductos = allProductos.filter(producto => new Date(producto.fecha_creacion) >= fechaLimite && producto.tipo_id === tipoId);
            setCrecienteProductos(filteredCrecienteProductos);
        } catch (error) {
            console.error("Error fetching productos creados recientemente:", error);
        }
    };

    const fetchMateriasPrimasCrecientes = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/articulo");
            const allMateriasPrimas = response.data.data;
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - 7); // Materias primas creadas hace una semana
            const filteredCrecienteMateriasPrimas = allMateriasPrimas.filter(materia => new Date(materia.fecha_creacion) >= fechaLimite && materia.tipo_id === materiaId);
            setCrecienteMateriasPrimas(filteredCrecienteMateriasPrimas);
        } catch (error) {
            console.error("Error fetching materias primas creadas recientemente:", error);
        }
    };

    const fetchDataAndExport = async () => {
        setLoading(true);
        try {
            await fetchData();

            // Convertir los datos a formato compatible con XLSX
            const wsP = productos.map(item => ({
                'Nombre': item.nombre,
                'Descripción': item.descripcion,
                'Cantidad': item.cantidad,
                'Tipo': item.tipo.nombre,
                'Serie': item.serie,
                'Materiales': item.materiales.map(mat => mat.nombre).join(', '),
            }));

            const wsM = materiasPrimas.map(item => ({
                'Nombre': item.nombre,
                'Descripción': item.descripcion,
                'Cantidad': item.cantidad,
                'Tipo': item.tipo.nombre,
                'Serie': item.serie,
            }));

            const wsRP = rproductos.map(item => ({
                'Nombre': item.nombre,
                'Descripción': item.descripcion,
                'Cantidad': item.cantidad,
                'Tipo': item.tipo.nombre,
                'Serie': item.serie,
                'Materiales': item.materiales.map(mat => mat.nombre).join(', '),
            }));

            const wsRM = rmateriasPrimas.map(item => ({
                'Nombre': item.nombre,
                'Descripción': item.descripcion,
                'Cantidad': item.cantidad,
                'Tipo': item.tipo.nombre,
                'Serie': item.serie,
            }));

            const wsCP = crecienteProductos.map(item => ({
                'Nombre': item.nombre,
                'Descripción': item.descripcion,
                'Cantidad': item.cantidad,
                'Tipo': item.tipo.nombre,
                'Serie': item.serie,
                'Materiales': item.materiales.map(mat => mat.nombre).join(', '),
            }));

            const wsCM = crecienteMateriasPrimas.map(item => ({
                'Nombre': item.nombre,
                'Descripción': item.descripcion,
                'Cantidad': item.cantidad,
                'Tipo': item.tipo.nombre,
                'Serie': item.serie,
            }));

            const wb = XLSX.utils.book_new();
            const wsProductos = XLSX.utils.json_to_sheet(wsP);
            const wsMateriasPrimas = XLSX.utils.json_to_sheet(wsM);
            const wsReP = XLSX.utils.json_to_sheet(wsRP);
            const wsReM = XLSX.utils.json_to_sheet(wsRM);
            const wsCProd = XLSX.utils.json_to_sheet(wsCP);
            const wsCMat = XLSX.utils.json_to_sheet(wsCM);

            XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos');
            XLSX.utils.book_append_sheet(wb, wsMateriasPrimas, 'Materias Primas');
            XLSX.utils.book_append_sheet(wb, wsReP, 'Re-Producto');
            XLSX.utils.book_append_sheet(wb, wsReM, 'Re-Materia Prima');
            XLSX.utils.book_append_sheet(wb, wsCProd, 'Cre-Producto');
            XLSX.utils.book_append_sheet(wb, wsCMat, 'Cre-Materia Prima');

            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            const s2ab = s => {
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            };
            FileSaver.saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "Data.xlsx");
        } catch (error) {
            console.error('Error exporting data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button label="Exportar Datos" icon="pi pi-file-excel" onClick={fetchDataAndExport} disabled={loading} />
            {loading && <p>Exportando datos...</p>}
        </div>
    );
};

export default Ejecutivo;
