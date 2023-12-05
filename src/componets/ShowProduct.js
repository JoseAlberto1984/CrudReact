import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from "../functions";


const ShowProduct = () => {
    const url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=odlZseuRhhzeQozH1IwoF0FgIcZrR5DkFwAglRKR';
    const [photos, setPhotos] = useState([]);
    const [id, setId] = useState('');
    const [sol, setSol] = useState('');
    const [earth_date, setEarthDate] = useState('');
    const [operation, setOperation] = useState('');
    const [title, setTitle] = useState('');

    useEffect( () => {
        getPhotos()
    }, []);

    const getPhotos = async () => {
        const respuesta = await axios.get(url);        
        setPhotos(respuesta.data.photos);      
    }

    const openModal = (op, id, sol, earth) =>{
        debugger;
        setId('');
        setSol('');
        setEarthDate('');
        if(op === 1){
            setTitle('Registrar Foto');
        }
        else if(op === 2){
            setTitle('Editar Foto');
            setId(id);
            setSol(sol);
            setEarthDate(earth);
        }
        window.setTimeout(() => {
            document.getElementById('id').focus();
        }, 500);

    }

 const validar = () => {
    var parametros;
    var metodo;

    if(id === ''){
        show_alerta('Escribe el id de la foto', 'warning')
    }
    
    else if(sol === ''){
        show_alerta('Escribe el sol de la foto', 'warning')
    }
    
    else if(earth_date.trim() === ''){
        show_alerta('Escribe la tierra de la foto', 'warning')
    }
    else{
        if(operation === 1){
            parametros= {id:id.trim, sol:sol, earth_date: earth_date.trim()};
            metodo= 'POST';
        }
        else{
            parametros= {id:id.trim, sol:sol, earth_date: earth_date.trim()};
            metodo= 'PUT';
        }

        enviarSolicitud(metodo, parametros);
    }

 }

 const enviarSolicitud = async(metodo, parametros) => {
    await axios({metod: metodo, url: url, data: parametros}).then(function(respuesta){

        debugger;
        var tipo = respuesta.status;
        if(tipo === 200){
            show_alerta('Solicitud realizada correctamente', 'good')
            document.getElementById('btCerrar').click();
            getPhotos();
        }
        else{
            show_alerta('Error en la solicitud', 'error');
        }
    }).catch(function(error){
        show_alerta('Error en la solicitud', 'error');
        console.log(error);        
    });

 }

 const eliminarSolicitud = (metodo, parametros) => {

 }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row-mt-3'>
                <div className='col-md-4 offset-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalPhotos'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-12'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ID</th>
                                    <th>SOL</th>
                                    <th>EARTH</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {photos.map( (photo,i)=>(
                                    <tr key={photo.id}>
                                        <td>{(i+1)}</td>
                                        <td>{photo.id}</td>
                                        <td>{photo.sol}</td>
                                        <td>{photo.earth_date}</td>
                                        <td>
                                            <button data-bs-toggle='modal' data-bs-target='#modalPhotos' onClick={() => openModal(2, photo.id, photo.sol, photo.earth_date)} className='btn btn-warning'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp;
                                            <button className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
        <div id='modalPhotos' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='hidden'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='id' className='form-control' placeholder='Id' value={id}
                            onChange={(e) => setId(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-sun'></i></span>
                            <input type='text' id='sol' className='form-control' placeholder='Sol' value={sol}
                            onChange={(e) => setSol(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-earth'></i></span>
                            <input type='text' id='earth_date' className='form-control' placeholder='Earth Date' value={earth_date}
                            onChange={(e) => setEarthDate(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    </div>
  )
}

export default ShowProduct