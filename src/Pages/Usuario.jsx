import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/usuario');
      const { success, data, message } = response.data;

      if (success) {
        setUsuarios(data);
      } else {
        throw new Error(message || 'No se pudieron obtener los usuarios.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const openDialog = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setDisplayDialog(true);
  };

  const hideDialog = () => {
    setDisplayDialog(false);
    setSubmitted(false);
    setUsuarioSeleccionado(null);
  };

  const saveUsuario = async () => {
    setSubmitted(true);

    try {
      if (usuarioSeleccionado.id) {
        await axios.put(`http://127.0.0.1:8000/api/usuario/${usuarioSeleccionado.id}`, usuarioSeleccionado);
      } else {
        await axios.post('http://127.0.0.1:8000/api/usuario', usuarioSeleccionado);
      }

      hideDialog();
      fetchUsuarios(); // Actualiza la lista de usuarios después de guardar
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const deleteUsuario = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/usuario/${usuarioSeleccionado.id}`);
      fetchUsuarios(); // Actualiza la lista de usuarios después de eliminar
      hideDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const dialogFooter = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUsuario} />
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h1 className="text-primary mb-4">Gestión de Usuarios</h1>

        <DataTable value={usuarios}>
          <Column field="nombre" header="Nombre" />
          <Column field="correo" header="Correo" />
          <Column body={(rowData) => (
            <div>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-primary p-mr-2" onClick={() => openDialog(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger" onClick={() => deleteUsuario(rowData)} />
            </div>
          )} />
        </DataTable>

        <Dialog visible={displayDialog} onHide={hideDialog} header={`${usuarioSeleccionado ? 'Editar' : 'Nuevo'} Usuario`} modal>
          <div className="p-field">
            <label htmlFor="nombre" className="font-weight-bold">Nombre</label>
            <InputText id="nombre" value={usuarioSeleccionado?.nombre || ''} onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre: e.target.value })} className="form-control" />
            {submitted && !usuarioSeleccionado?.nombre && <small className="p-error">El nombre es requerido.</small>}
          </div>

          <div className="p-field">
            <label htmlFor="correo" className="font-weight-bold">Correo</label>
            <InputText id="correo" value={usuarioSeleccionado?.correo || ''} onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, correo: e.target.value })} className="form-control" />
            {submitted && !usuarioSeleccionado?.correo && <small className="p-error">El correo es requerido.</small>}
          </div>

          <div className="p-d-flex p-jc-end mt-4">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger p-ml-2" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-success p-ml-2" onClick={saveUsuario} />
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Usuarios;

