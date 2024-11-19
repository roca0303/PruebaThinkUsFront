
export class ProfesorService {

    async getProfesorList() {
        try {
            const response = await fetch('http://localhost:43497/api/Profesor', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
    
            if (!response.ok) {
                return "Error";
            }
    
            const data = await response.json();
            return data; // Retorna los datos correctamente
        } catch (error) {
            return "Error";
        }
    }

    newProfesor(empleadoData, token) {
        var respuesta = fetch('http://localhost:43497/api/Profesor', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(empleadoData)
        })
        .then( function (data) {
            if (data.status >= 300 ){
                return "Error";
            }
            else{
                const statusCode = data.status;
                const data_json = data.json();
                return { statusCode, data_json };
            }
        })
        .catch(error => console.error('Error:', error));        
        return respuesta;
    }

    deleteProfesor(id) {
        var respuesta = fetch('http://localhost:43497/api/Profesor/'+id.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then( function (data) {
            console.log(data.status);
            if (data.status >= 300 ){
                return "Error";
            }
            else{
                const statusCode = data.status;
                return { statusCode };
            }
        })
        .catch(error => console.error('Error:', error));        
        return respuesta;
    }

    updateProfesor(empleadoData) {
        var respuesta = fetch('http://localhost:43497/api/Profesor/'+empleadoData.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(empleadoData)
        })
        .then( function (data) {
            console.log(data.status);
            if (data.status >= 300 ){
                return "Error";
            }
            else{
                const statusCode = data.status;
                return { statusCode };
            }
        })
        .catch(error => console.error('Error:', error));        
        return respuesta;
    }

}
