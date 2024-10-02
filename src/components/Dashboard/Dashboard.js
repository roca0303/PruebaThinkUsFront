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
import { FileUpload } from 'primereact/fileupload';
// import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { RadioButton } from 'primereact/radiobutton';
// import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import useToken from '../App/useToken';


function App() {
    return (
        <div>
            <DataTableCrudDemo />
        </div>
    );
}

const DataTableCrudDemo = () => {

    let emptyProduct = {
        id: null,
        nombre: '',
        bandera: null,
    };

    const [products, setProducts] = useState(null);
    const [selectedFile, setselectedFile] = useState(null);
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

    useEffect(() => {
        empleadoService.getTeamsList().then(data => {
            if (data == "Error"){
                setPermisoPagina(null);
                setProducts(null);
            }
            else{
                setPermisoPagina(true);
                setProducts(data);
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        let _products = [...products];
        let _product = {...product};
        if (product.id) {
            const index = findIndexById(product.id);

            _products[index] = _product;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        }
        else {

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

            //let bandera = _product.bandera;
            const newTeamResponse = await empleadoService.newTeam({
                nombre,
                posicion,
                descripcion,
                estado
            },token);

            if ( newTeamResponse.statusCode <= 300 ){
                empleadoService.getTeamsList(token).then(data => setProducts(data));
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

    // const editProduct = (product) => {
    //     setProduct({...product});
    //     setProductDialog(true);
    // }

    // const confirmDeleteProduct = (product) => {
    //     setProduct(product);
    //     setDeleteProductDialog(true);
    // }

    const deleteProduct = () => {
        let _products = products.filter(val => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = products.filter(val => selectedProducts.includes(val));
        let _products_avaibles = products.filter(val => !selectedProducts.includes(val));

        _products.map ( async (product) => {
            let id = product.id;
            // enviar el id del producto a eliminar
            const deleteEmpleadoResponse = await empleadoService.deleteEmpleado({
                id
            },token);
        });

        setProducts(_products_avaibles);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Empleados Borrados', life: 3000 });
    }

    // const onCategoryChange = (e) => {
    //     let _product = {...product};
    //     _product['category'] = e.value;
    //     setProduct(_product);
    // }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
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


    // const imageBodyTemplate = (rowData) => {
    //     let url = process.env.REACT_APP_URL_IMAGES+rowData.bandera;
    //     return <img src={url} 
    //         onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} 
    //         alt={rowData.bandera} className="product-image" />
    // }

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
                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}
                    <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                    <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} selecciones"
                        globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                        {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
                        <Column selectionMode="multiple" exportable={false}></Column>
                        <Column field="id" header="id" sortable style={{ minWidth: '6rem' }}></Column>
                        <Column field="nombre" header="nombre" sortable style={{ minWidth: '6rem' }}></Column>
                        <Column field="posicion" header="posicion" sortable style={{ minWidth: '6rem' }} ></Column>
                        <Column 
                            field="estado" 
                            header="estado" 
                            sortable 
                            style={{ minWidth: '6rem' }} 
                            body={rowData => rowData.estado === true ? 'Activo' : 'Inactivo'}> 
                        </Column>
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
                </Dialog>

                <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {product && <span>Are you sure you want to delete the selected products?</span>}
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
