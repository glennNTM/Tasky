import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, 'Veuillez fournir un titre pour la tâche'],
      trim: true,
      minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
    },
    dateEcheance: {
      type: Date,
      required: [true, 'Veuillez fournir une date d’échéance']
    },
    priorité: {
      type: String,
      enum: {
        values: ['basse', 'moyenne', 'haute'],
        message: 'La priorité doit être "basse", "moyenne" ou "haute"'
      },
      default: 'moyenne'
    },
    statut: {
      type: String,
      enum: {
        values: ['en cours', 'terminée', 'en attente'],
        message: 'Le statut doit être "en cours", "terminée" ou "en attente"'
      },
      default: 'en attente'
    },
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La tâche doit être associée à un utilisateur']
    }
  },
  { timestamps: true }
)

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema)

export default Task
