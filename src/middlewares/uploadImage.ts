import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto'; // Importar el módulo crypto
import sharp from 'sharp'; // Importar sharp para optimizar la imagen

// Configuración de almacenamiento temporal de Multer
const storage = multer.memoryStorage(); // Guardar el archivo temporalmente en memoria

// Filtro para aceptar solo imágenes
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
  }
};

// Configurar Multer para usar almacenamiento en memoria
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Función para crear el middleware personalizado
export const uploadImage = (propertyName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Usar Multer para manejar la subida
    const uploadSingle = upload.single(propertyName); // 'image' es el campo de la solicitud que contiene la imagen

    uploadSingle(req, res, async (err: any) => {
      if (err instanceof multer.MulterError) {
        // Errores de Multer
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Otros errores
        return res.status(400).json({ message: err.message });
      }

      // Si no hay archivo, continuar
      if (!req.file) {
        next();
        return;
      }

      // Generar un nombre de archivo único usando crypto.randomUUID
      const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`;
      const newFilename = `${propertyName}-${uniqueSuffix}.webp`; // Cambiar a formato webp

      // Ruta donde se guardará la imagen optimizada
      const outputPath = path.join(
        __dirname,
        '../../public/uploads',
        newFilename,
      );

      try {
        // Usar sharp para optimizar la imagen
        await sharp(req.file.buffer)
          .resize(128, 128, {
            fit: 'cover', // Ajustar la imagen para que sea 128x128, recortando si es necesario
          })
          .webp({ quality: 80 }) // Convertir a webp con calidad 80
          .toFile(outputPath); // Guardar la imagen en disco

        // Construir la URL completa de la imagen
        const imagePath = `/public/uploads/${newFilename}`;

        // Añadir la propiedad personalizada al body
        req.body[propertyName] = imagePath;

        next();
      } catch (imageError) {
        console.log(imageError);
        // Si hay un error al procesar la imagen, devolver un error
        return res.status(500).json({ message: 'Error al procesar la imagen' });
      }
    });
  };
};
