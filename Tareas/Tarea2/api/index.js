const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

// Conexión a MongoDB (asegúrate de tener MongoDB instalado y corriendo)
mongoose.connect('mongodb://localhost:27017/tarea2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Este es el esquema para las imágenes
const imageSchema = new mongoose.Schema({
  imageBase64Data: String,
  fechaDeCarga: { type: Date, default: Date.now },
});

const Image = mongoose.model('images', imageSchema);

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint para cargar una imagen en base64 y registrar la fecha de carga
app.post('/load-image', async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Es necesario cargar la imagen' });
    }

    const newImage = new Image({ imageBase64Data: imageData });
    await newImage.save();

    return res.status(201).json({ message: 'Imagen guardada exitosamente.' });
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    return res.status(500).json({ error: 'Error en el servidor.' });
  }
});


app.listen(port, () => {
  console.log(`Servidor en puerto: ${port}`);
});
