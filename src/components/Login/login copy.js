
import React, { useState } from "react";
//import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login ({ setToken })  {

    const [email, setUserName] = useState();
    const [password, setPassword] = useState();
    const [remember, setRemember] = useState();
  
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            email,
            password,
            remember
        });
        console.log (token);
        setToken(token);
    }

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
                            <FontAwesomeIcon icon={faHome} />
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </section>
    );
}


// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import './login.css';
// import ReactBootstrap, {Jumbotron, Button, Col, Grid, Panel, FormGroup, Navbar, Nav, NavDropdown} from 'react-bootstrap';
// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

async function loginUser(credentials) {
    
    var respuesta = fetch('http://localhost/public/laraveldocker/public/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json());
    //respuesta.status;
    return respuesta;
}

// export default function Login({ setToken }) {

//     const [email, setUserName] = useState();
//     const [password, setPassword] = useState();

//     const handleSubmit = async e => {
//         e.preventDefault();
//         const token = await loginUser({
//             email,
//             password
//         });
//         if (token[0] == "Unauthorized")
//             token = null;
//         setToken(token);
//     }
//     //     render () {
//     //         return (

//     //          <label>
//     //         <p>Username: digitar nombre de usuario </p>
//     //         <input type="text" onChange={e => setUserName(e.target.value)} />
//     //         </label>
//     //         <label>
//     //         <p>Password</p>
//     //         <input type="password" onChange={e => setPassword(e.target.value)} />
//     //         </label>
//     //         <div>
//     //         <button type="submit">Submit</button>
//     //         </div> 
        
//     //     );
//     // };
// }

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};