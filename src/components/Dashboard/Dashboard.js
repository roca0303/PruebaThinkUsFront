import React, { useState, useEffect, useRef } from 'react';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import "primeflex/primeflex.css";
import '../../index.css';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { EmpleadoService } from '../DataTables/EmpleadoService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api';
import useToken from '../App/useToken';


function App() {
    return (
        <div>
            <DataTableCrudDemo />
        </div>
    );
}

const DataTableCrudDemo = () => {
    
    FilterService.register('custom_activity', (value, filters) => {
        const [from, to] = filters ?? [null, null];
        if (from === null && to === null) return true;
        if (from !== null && to === null) return from <= value;
        if (from === null && to !== null) return value <= to;
        return from <= value && value <= to;
      });

    let emptyProduct = {
        id: null,
        nombre: '',
        posicion: '',
        descripcion: '',
        estado: true
    };

    const [empleados, setEmpleados] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const empleadoService = new EmpleadoService();
    const { token } = useToken();
    const [permisoPagina, setPermisoPagina] = useState(null);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        posicion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        empleadoService.getTeamsList().then(data => {
            if (data === "Error"){
                setPermisoPagina(null);
                setEmpleados(null);
            }
            else{
                setPermisoPagina(true);
                setEmpleados(data);
            }
        });
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = async e => {
        setSubmitted(true);
        let _products = [...empleados];
        let _product = {...product};


        let nombre = _product.nombre;
        let posicion = _product.posicion;
        let descripcion = _product.descripcion;
        let estado = true;

        // evaluar que no venga vacio ningun campo
        if (nombre === '' || posicion === '' || descripcion === '' || estado === ''){
            return;
        }

        // validar que los campos sean correctos y no tengan caracteres especiales
        if (nombre.match(/^[a-zA-Z\s]*$/) === null || posicion.match(/^[a-zA-Z\s]*$/) === null || descripcion.match(/^[a-zA-Z\s]*$/) === null){
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Caracteres invalidos', life: 3000 });
            return;
        }

        if (product.id) {

            //const index = findIndexById(product.id);
            const newTeamResponse = await empleadoService.updateEmpleado({
                id: product.id,
                nombre: product.nombre,
                posicion: product.posicion,
                descripcion: product.descripcion,
                estado: product.estado
            },token);

            if ( newTeamResponse.statusCode <= 300 ){
                empleadoService.getTeamsList(token).then(data => setEmpleados(data));
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Empleado Actualizado Correctamente', life: 3000 });
                _products.push(_product);
            }
            else{
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error Al Actualizar Empleado', life: 3000 });
            }
        }
        else {
            const newTeamResponse = await empleadoService.newEmpleado({
                nombre,
                posicion,
                descripcion,
                estado
            },token);

            if ( newTeamResponse.statusCode <= 300 ){
                empleadoService.getTeamsList(token).then(data => setEmpleados(data));
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Empleado Creado Correctamente', life: 3000 });
            }
            else{
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error Al Crear Empleado', life: 3000 });
            }
            _products.push(_product);
        }
        setProductDialog(false);
        setProduct(emptyProduct);
    }

    const editProduct = (product) => {
        setProduct({...product});
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        //let _empleados = empleados.filter(val => val.id === product.id);
        let _empleados_avaibles = empleados.filter(val => val.id !== product.id);

        let id = product.id;
        const deleteEmpleadoResponse = empleadoService.deleteEmpleado({
            id
        },token);

        setEmpleados(_empleados_avaibles);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _empleados = empleados.filter(val => selectedProducts.includes(val));
        let _empleados_avaibles = empleados.filter(val => !selectedProducts.includes(val));

        _empleados.map ( async (product) => {
            let id = product.id;
            const deleteEmpleadoResponse = await empleadoService.deleteEmpleado({
                id
            },token);
        });

        setEmpleados(_empleados_avaibles);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Empleados Borrados', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = e.target.type === 'checkbox' ? e.checked : e.target.value;
        //const val = (e.target && e.target.value) || '';
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Selecciones</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    if ( permisoPagina === true){
        return (
            <div className="datatable-crud-demo">
                <Toast ref={toast} />

                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                    <DataTable ref={dt} value={empleados} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} selecciones"
                        globalFilter={globalFilter} header={header} responsiveLayout="scroll"
                        filters={filters} filterDisplay="row" loading={loading}
                        >
                        <Column selectionMode="multiple" exportable={false}></Column>
                        <Column field="id" header="id" sortable style={{ minWidth: '6rem' }}></Column>
                        <Column field="nombre" header="nombre" filter filterPlaceholder="Buscar por nombre" sortable style={{ minWidth: '6rem' }}></Column>
                        <Column field="posicion" header="posicion" filter filterPlaceholder="Buscar por posicion"  filterField="posicion"  sortable style={{ minWidth: '6rem' }} ></Column>
                        <Column field="descripcion" header="descripcion" sortable style={{ minWidth: '6rem' }} ></Column>
                        <Column 
                            field="estado" 
                            header="estado" 
                            sortable 
                            style={{ minWidth: '6rem' }} 
                            body={rowData => rowData.estado === true ? 'Activo' : 'Inactivo'}> 
                        </Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

                    </DataTable>
                </div>

                <Dialog visible={productDialog} style={{ width: '450px' }} header="Nuevo Empleado" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                    <div className="field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                        {submitted && !product.nombre && <small className="p-error">El Nombre es requerido.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="posicion">Posicion</label>
                        <InputText id="posicion" value={product.posicion} onChange={(e) => onInputChange(e, 'posicion')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.posicion })} />
                        {submitted && !product.posicion && <small className="p-error">La Posición del empleado es requerida.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="descripcion">Descripción</label>
                        <InputText id="descripcion" value={product.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.descripcion })} />
                        {submitted && !product.descripcion && <small className="p-error">La descripción del empleado es requerida.</small>}
                    </div>
                    <div className="field-checkbox">
                        <Checkbox inputId="estado" checked={product.estado} onChange={(e) => onInputChange(e, 'estado')} />
                        <label htmlFor="estado">Activo</label>
                    </div>
                </Dialog>

                <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {product && <span>Esta seguro de eliminar el registro <b>{product.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {product && <span>Esta seguro de eliminar los registros seleccionados?</span>}
                    </div>
                </Dialog>
            </div>
        );
    }
    return (
        <div>
            <h2></h2>
        </div>
    );

}
export default App;
