import React, { useState, useEffect, useRef } from 'react';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import "primeflex/primeflex.css";
import '../../index.css';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api';
import useToken from '../App/useToken';
//import { ProfesorService } from '../Services/ProfesorService';
import { ProfesorService } from '../Services/ProfesorService';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';


function App() {
    return (
        <div>
            <DataTableCrudProfesor />
        </div>
    );
}

const DataTableCrudProfesor = () => {
    
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
        apellidos: '',
        genero: '',
    };

    const genderOptions = [
        { label: 'Masculino', value: 'male' },
        { label: 'Femenino', value: 'female' },
        { label: 'Otro', value: 'other' },
        { label: 'No especifica', value: 'na' }
    ];

    const [profesores, setProfesores] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const profesorService = new ProfesorService();
    const { token } = useToken();
    const [permisoPagina, setPermisoPagina] = useState(null);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        apellidos: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        profesorService.getProfesorList().then(data => {
            if (data === "Error"){
                setPermisoPagina(null);
                setProfesores(null);
            }
            else{
                setPermisoPagina(true);
                setProfesores(data);
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

    const onInputChangeDateTime = (e, name) => {
        const val = e.value; // `e.value` contiene el objeto Date que devuelve el Calendar
        let _product = { ...product };
        _product[name] = val; // Asigna directamente el objeto Date
        setProduct(_product);


        // const val = (e.target && e.target.value) || '';
        // let _product = {...product};
        // _product[`${name}`] = val;
        // setProduct(_product);
    }

    const saveProduct = async e => {
        setSubmitted(true);
        let _products = [...profesores];
        let _product = {...product};

        let Nombre = _product.nombre;
        let Apellidos = _product.apellidos;
        let Genero = _product.genero;
        let FechaNacimiento = _product.fechaNacimiento;

        // evaluar que no venga vacio ningun campo
        if (Nombre === '' || Apellidos === '' || Genero === '' || FechaNacimiento === ''){
            console.log(_product);
            return;
        }

        // validar que los campos sean correctos y no tengan caracteres especiales
        if (Nombre.match(/^[a-zA-Z\s]*$/) === null || Apellidos.match(/^[a-zA-Z\s]*$/) === null || Genero.match(/^[a-zA-Z\s]*$/) === null){
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Caracteres invalidos', life: 3000 });
            return;
        }
        
        if (product.id) {

            //const index = findIndexById(product.id);
            const newTeamResponse = await profesorService.updateProfesor({
                id: product.id,
                Nombre: product.nombre,
                Apellidos: product.apellidos,
                Genero: product.genero,
                FechaNacimiento: product.fechaNacimiento
            },token);

            if ( newTeamResponse.statusCode <= 300 ){
                profesorService.getProfesorList(token).then(data => setProfesores(data));
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profesor Actualizado Correctamente', life: 3000 });
                _products.push(_product);
            }
            else{
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error Al Actualizar Profesor', life: 3000 });
            }
        }
        else {
            const newTeamResponse = await profesorService.newProfesor({
                Nombre,
                Apellidos,
                Genero,
                FechaNacimiento
            },token);

            if ( newTeamResponse.statusCode <= 300 ){
                profesorService.getProfesorList(token).then(data => setProfesores(data));
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profesor Creado Correctamente', life: 3000 });
            }
            else{
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error Al Crear Profesor', life: 3000 });
            }
            _products.push(_product);
        }
        setProductDialog(false);
        setProduct(emptyProduct);
    }

    const editProduct = (product) => {
        console.log({...product});
        const fechaNacimientos = product.fechaNacimiento ? new Date(product.fechaNacimiento) : null;

        setProduct({...product});
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {

        let _empleados_avaibles = profesores.filter(val => val.id !== product.id);

        let id = product.id;
        const deleteEmpleadoResponse = profesorService.deleteProfesor({
            id
        },token);

        setProfesores(_empleados_avaibles);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _empleados = profesores.filter(val => selectedProducts.includes(val));
        let _empleados_avaibles = profesores.filter(val => !selectedProducts.includes(val));

        _empleados.map ( async (product) => {
            let id = product.id;
            const deleteEmpleadoResponse = await profesorService.deleteProfesor({
                id
            },token);
        });

        setProfesores(_empleados_avaibles);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profesores Borrados', life: 3000 });
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

                    <DataTable ref={dt} value={profesores} className="data-table-80" selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} selecciones"
                        globalFilter={globalFilter} header={header} responsiveLayout="scroll"
                        filters={filters} filterDisplay="row" loading={loading}
                        >
                        <Column selectionMode="multiple" exportable={false}></Column>
                        <Column field="id" header="id" sortable style={{ minWidth: '6rem' }}></Column>
                        <Column field="nombre" header="nombre" filter filterPlaceholder="Buscar por nombre" sortable style={{ minWidth: '6rem' }}></Column>
                        <Column field="apellidos" header="apellidos" filter filterPlaceholder="Buscar por posicion"  filterField="apellidos"  sortable style={{ minWidth: '6rem' }} ></Column>
                        <Column field="genero" header="Genero" sortable style={{ minWidth: '6rem' }} ></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={productDialog} style={{ width: '450px' }} header="Nuevo Alumno" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                    <div className="field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
                        {submitted && !product.nombre && <small className="p-error">El Nombre es requerido.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="apellidos">Apellidos</label>
                        <InputText id="apellidos" value={product.apellidos} onChange={(e) => onInputChange(e, 'apellidos')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.apellidos })} />
                        {submitted && !product.apellidos && <small className="p-error">El Apellido es requerido.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="Genero">Género</label>
                        <Dropdown
                            id="genero"
                            value={product.genero}
                            options={genderOptions}
                            onChange={(e) => onInputChange(e, 'genero')}
                            placeholder="Seleccione un género"
                            className={classNames({ 'p-invalid': submitted && !product.genero })}
                        />
                        {submitted && !product.genero && (
                            <small className="p-error">El género del alumno es requerido.</small>
                        )}
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
