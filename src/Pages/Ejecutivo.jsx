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
    const [minP, setMinP] = useState(10);
    const [minM, setMinM] = useState(10); 
    const tipoId = 2;
    const materiaId = 1;
    const [produccion, setProduccion] = useState(null);
    const [producciones, setProducciones] = useState([]);
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
    const fetchProducciones = async () => {
        try {
            const response = await axios.get("http://3.147.242.40/api/orden-produccion");
            setProducciones(response.data.data);
        } catch (error) {
            console.error("Error fetching producciones:", error);
        }
    };
    const fetchDataAndExport = async () => {
        setLoading(true);
        try {
            await fetchData();

            const wsP = productos.map(item => ({
                'Nombre': { v: item.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Descripción': { v: item.descripcion, s: { border: { bottom: { style: 'thin' } } } },
                'Cantidad': { v: item.cantidad, s: { border: { bottom: { style: 'thin' } } } },
                'Tipo': { v: item.tipo.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Serie': { v: item.serie, s: { border: { bottom: { style: 'thin' } } } },
                'Materiales': { v: item.materiales.map(mat => mat.nombre).join(', '), s: { border: { bottom: { style: 'thin' } } } },
            }));

            const wsM = materiasPrimas.map(item => ({
                'Nombre': { v: item.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Descripción': { v: item.descripcion, s: { border: { bottom: { style: 'thin' } } } },
                'Cantidad': { v: item.cantidad, s: { border: { bottom: { style: 'thin' } } } },
                'Tipo': { v: item.tipo.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Serie': { v: item.serie, s: { border: { bottom: { style: 'thin' } } } },
            }));

            const wsRP = rproductos.map(item => ({
                'Nombre': { v: item.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Descripción': { v: item.descripcion, s: { border: { bottom: { style: 'thin' } } } },
                'Cantidad': { v: item.cantidad, s: { border: { bottom: { style: 'thin' } } } },
                'Tipo': { v: item.tipo.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Serie': { v: item.serie, s: { border: { bottom: { style: 'thin' } } } },
                'Materiales': { v: item.materiales.map(mat => mat.nombre).join(', '), s: { border: { bottom: { style: 'thin' } } } },
            }));

            const wsRM = rmateriasPrimas.map(item => ({
                'Nombre': { v: item.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Descripción': { v: item.descripcion, s: { border: { bottom: { style: 'thin' } } } },
                'Cantidad': { v: item.cantidad, s: { border: { bottom: { style: 'thin' } } } },
                'Tipo': { v: item.tipo.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Serie': { v: item.serie, s: { border: { bottom: { style: 'thin' } } } },
            }));

            const wsCP = crecienteProductos.map(item => ({
                'Nombre': { v: item.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Descripción': { v: item.descripcion, s: { border: { bottom: { style: 'thin' } } } },
                'Cantidad': { v: item.cantidad, s: { border: { bottom: { style: 'thin' } } } },
                'Tipo': { v: item.tipo.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Serie': { v: item.serie, s: { border: { bottom: { style: 'thin' } } } },
                'Materiales': { v: item.materiales.map(mat => mat.nombre).join(', '), s: { border: { bottom: { style: 'thin' } } } },
            }));

            const wsCM = crecienteMateriasPrimas.map(item => ({
                'Nombre': { v: item.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Descripción': { v: item.descripcion, s: { border: { bottom: { style: 'thin' } } } },
                'Cantidad': { v: item.cantidad, s: { border: { bottom: { style: 'thin' } } } },
                'Tipo': { v: item.tipo.nombre, s: { border: { bottom: { style: 'thin' } } } },
                'Serie': { v: item.serie, s: { border: { bottom: { style: 'thin' } } } },
            }));

            const wb = XLSX.utils.book_new();
            const wsProductos = XLSX.utils.json_to_sheet(wsP, { headerStyles: { font: { bold: true } } });
            const wsMateriasPrimas = XLSX.utils.json_to_sheet(wsM, { headerStyles: { font: { bold: true } } });
            const wsReP = XLSX.utils.json_to_sheet(wsRP, { headerStyles: { font: { bold: true } } });
            const wsReM = XLSX.utils.json_to_sheet(wsRM, { headerStyles: { font: { bold: true } } });
            const wsCProd = XLSX.utils.json_to_sheet(wsCP, { headerStyles: { font: { bold: true } } });
            const wsCMat = XLSX.utils.json_to_sheet(wsCM, { headerStyles: { font: { bold: true } } });

            applyBorders(wsProductos, productos.length + 1);
            applyBorders(wsMateriasPrimas, materiasPrimas.length + 1);
            applyBorders(wsReP, rproductos.length + 1);
            applyBorders(wsReM, rmateriasPrimas.length + 1);
            applyBorders(wsCProd, crecienteProductos.length + 1);
            applyBorders(wsCMat, crecienteMateriasPrimas.length + 1);

            XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos');
            XLSX.utils.book_append_sheet(wb, wsMateriasPrimas, 'Materias Primas');
            XLSX.utils.book_append_sheet(wb, wsReP, 'Re-Producto');
            XLSX.utils.book_append_sheet(wb, wsReM, 'Re-Materia Prima');
            XLSX.utils.book_append_sheet(wb, wsCProd, 'Cre-Producto');
            XLSX.utils.book_append_sheet(wb, wsCMat, 'Cre-Materia Prima');

            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            FileSaver.saveAs(blob, `Inventario Actual ${new Date().toLocaleDateString()}.xlsx`);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }

        setLoading(false);
    };


    const fetchOrden = async () => {
        setLoading(true);
        try {
            await fetchData();

            const wsPr = producciones.map(item => ({
                'Usuario Generador': { v: item.usuario_generado.username, s: { border: { bottom: { style: 'thin' } } } },
                }));

            const wb = XLSX.utils.book_new();
            const wsProducciones = XLSX.utils.json_to_sheet(wsPr, { headerStyles: { font: { bold: true } } });
            
            applyBorders(wsProducciones, producciones.length + 1);

            XLSX.utils.book_append_sheet(wb, wsProducciones, 'Producciones');

            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            FileSaver.saveAs(blob, `Orden de Produccion ${new Date().toLocaleDateString()}.xlsx`);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }

        setLoading(false);
    };

    const applyBorders = (worksheet, rowCount) => {
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = { c: C, r: R };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                if (!worksheet[cellRef]) continue;

                worksheet[cellRef].s = {
                    border: {
                        bottom: { style: 'thin' },
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                };

                if (R === 0) {
                    worksheet[cellRef].s.font = { bold: true };
                }
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h1 className="text-primary mb-4">Reporte de inventario</h1>
            
            <div className="d-flex justify-content-center mt-3">
                    <Button
                      label={loading ? 'Exportando...' : 'Exportar a Excel'}
                      type="submit"
                      className="p-button-success"
                      disabled={loading}
                      onClick={fetchDataAndExport}
                    />
                  </div>
            </div>
         
            
        </div>
        
    );
};

export default Ejecutivo;
