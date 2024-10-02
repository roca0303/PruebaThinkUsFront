
import React, { useState } from "react";
import PropTypes from 'prop-types';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

export default function Login ({ setToken })  {


    const [email, setUserName] = useState();
    const [password, setPassword] = useState();
    const [remember, setRemember] = useState();
    
    const [errores, setErrores] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        const tokenObtenido = await loginUser({
            email,
            password,
            remember
        });
        if (  tokenObtenido.hasOwnProperty('errors')  )
        {
            setToken (null);
            setErrores (tokenObtenido.errors.email);
        }
        else
        {
            setToken (tokenObtenido);

        }
        setToken(tokenObtenido);
    }
    let url = process.env.REACT_APP_URL_IMAGES+"logoQtar.png";

    return (
        <section className="ftco-section">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center mb-5">
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">
                    <div className="login-wrap p-4 p-md-5">
                        <div className="icon d-flex align-items-center justify-content-center">
                            <span className="fa fa-user-o"></span>

                            <img src={url} 
                                onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} 
                                alt="cualquier cosa" width="100" height="100" className="product-image" />

                            {/* <FontAwesomeIcon icon={faHome} /> */}
                        </div>
                        <h3 className="text-center mb-4">Ingresar</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type="text" className="form-control rounded-left" placeholder="Username" onChange={e => setUserName(e.target.value)}  />
                            </div>
                            <div className="form-group d-flex">
                            <input type="password" className="form-control rounded-left" placeholder="Password" onChange={e => setPassword(e.target.value)}  />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="form-control btn btn-primary rounded submit px-3">Login</button>
                            </div>
                            <div className="form-group d-md-flex">
                                <div className="w-50">
                                    <label className="checkbox-wrap checkbox-primary">Remember Me
                                    <input type="checkbox" checked  onChange={e => setRemember(e.target.value)}   />
                                    <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className="w-50 text-md-right">
                                    <a href="/#">Forgot Password</a>
                                </div>
                            </div>
                            <p className="text-danger">{errores}</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </section>
    );
}

async function loginUser(credentials) {
    
//    var respuesta = fetch('http://192.168.1.27/public/laraveldocker/public/api/auth/login', {
    var respuesta = fetch(process.env.REACT_APP_URL+'auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(credentials)
    })
    // .then((response) => {
    //         return response; 
    // });
    .then(data => data.json());    
    return respuesta;
}


Login.propTypes = {
    setToken: PropTypes.func.isRequired
};