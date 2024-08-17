import mongoose, { mongo } from 'mongoose'

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export const MessageModel = mongoose.model('Message', MessageSchema)
