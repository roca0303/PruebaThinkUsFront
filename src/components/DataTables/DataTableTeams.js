import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import { useState, useEffect } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { TeamService } from './TeamService';
import '../../estilos/DataTableDemo.css';
import { Button } from 'primereact/button';
import Container from 'react-bootstrap/Container';
import useToken from '../App/useToken';

export const DataTableTeams = () => {
        const { token } = useToken();
        const [products, setProducts] = useState([]);

        const columns = [
            {field: 'id', header: 'id'},
            {field: 'nombre', header: 'nombre'},
            {field: 'bandera', header: 'bandera'},
        ];

        useEffect(() => {
            const productService = new TeamService();
            productService.getTeamsList(token).then(data => setProducts(data));
        }, [])

        const dynamicColumns = columns.map((col,i) => {
            return <Column key={col.field} field={col.field} header={col.header} />;
        });

        const header = (
            <div className="table-header">
                    Equipos
                <Button icon="pi pi-refresh" />
            </div>
        );
        const footer = `Total de equipos: ${products ? products.length : 0}.`;

        return (
            <Container>
            <div className="datatable-templating-demo">
                <div className="card">
                    <DataTable value={products} header={header} footer={footer} responsiveLayout="scroll">
                        {dynamicColumns}
                    </DataTable>
                </div>
            </div>
            </Container>
        );
    }


