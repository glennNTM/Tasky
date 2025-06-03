import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Veuillez renseigner votre nom complet.'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères.'],
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères.'],
    },

    email: {
      type: String,
      required: [true, 'Veuillez renseigner votre adresse e-mail.'],
      trim: true,
      minlength: [5, 'L’e-mail doit contenir au moins 5 caractères.'],
      maxlength: [255, 'L’e-mail ne peut pas dépasser 255 caractères.'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Veuillez fournir une adresse e-mail valide.',
      ],
    },
    password: {
      type: String,
      required: [true, 'Veuillez fournir un mot de passe.'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.'],
    },
    profileImageUrl: { type: String, default: null },

    role: {
      type: String,
      enum: {
        values: ['tasker', 'admin'],
      },
      default: 'tasker',
    },
  },
  { timestamps: true }
)

// Bonne pratique : éviter les erreurs en dev avec hot-reload (nodemon)
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
