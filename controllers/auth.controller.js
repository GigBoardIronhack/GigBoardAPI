const User = require("../models/User.model");
const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const multer = require("multer");
const nodemailer = require('nodemailer');

module.exports.register = async (req, res, next) => {
  if (req.file) req.body.imageUrl = req.file.path;
  try {
    const user = await User.create(req.body);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      requireTLS: true, // true si usas el puerto 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✨ Configuración del correo
    const mailOptions = {
      from: `"GigBoard" <${process.env.EMAIL_USER}>`, 
      to: user.email, 
      subject: "Bienvenido a GigBoard", 
      text: `¡Hola ${user.name}!\n\nBienvenido a GigBoard. Estamos emocionados de tenerte con nosotros. ¡Esperamos que disfrutes de la experiencia!`, 
      html: `<b>¡Hola ${user.name}!</b><br><br>Bienvenido a GigBoard. Estamos emocionados de tenerte con nosotros. ¡Esperamos que disfrutes de la experiencia como ${user.role} !`,
    };

    // ✨ Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente a:", user.email);
    
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]; 
      return res.status(400).json({ errors: { [field]: `${field} ya está registrado` } });
    }
    if (error.name === "ValidationError") {
      const errors = {};
      
      Object.keys(error.errors).forEach((field) => {
        errors[field] = error.errors[field].message; 
      });
    
      return res.status(400).json({ errors });
    }

    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const loginError = createError(401, "email or password incorrect");

    const user = await User.findOne({ email });
    

    if (!user) {
      return next(loginError);
    }
    const match = await user.checkPassword(password);

    if (!match) {
      return next(loginError);
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "1d" }
    );
    res.status(200).json({ 
      accessToken: token, 
      user: { id: user.id, role: user.role}
     });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.currentUserId).populate("artists");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
