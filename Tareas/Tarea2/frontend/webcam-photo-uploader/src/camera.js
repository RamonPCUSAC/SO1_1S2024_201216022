import React, {useState}from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import './camera.css';

function Camera(){
    const [image, setImage] = useState(null);
  const webcamRef = React.useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const uploadImage = async () => {
    try {
      if (!image) {
        console.error('No se ha capturado ninguna imagen.');
        return;
      }

      // Convertir la imagen en base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image;
      img.onload = () => {
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0);
        const base64Image = canvas.toDataURL();
        console.log(base64Image);
        // Enviar la imagen al servidor
        /* axios.post('http://localhost:3001/load-image', {
          imageData: base64Image,
        }).then(response => {
          console.log(response.data.message);
        }).catch(error => {
          console.error('Error al subir la imagen:', error);
        }); */

        fetch('http://localhost:3001/load-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageData: base64Image
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log(data)
          })
          .catch(error => console.error('Error al insertar imagen', error));
          };
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };
    return (
        <div class="App">
          <div class="camera-container">
            <h1>Tomar y Cargar Foto</h1>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              height={480}
            />
            <button onClick={captureImage}>Tomar Foto</button>
          </div>

          {image && (
            <div class="image-container">
              <h2>Imagen Capturada:</h2>
              <img src={image} alt="Captured" />
              <div class="button-container">
                <button onClick={uploadImage}>Subir Imagen</button>
              </div>
            </div>
          )}
        </div>
    );
}

export default Camera;