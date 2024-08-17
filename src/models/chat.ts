import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    isGroup: {
        type: Boolean,
    },
    groupName: {
        type: String,
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    ],
})

export const ChatModel = mongoose.model('Chat', chatSchema)

export const getChatById = async (id: string) => await ChatModel.findById(id)
export const getChatByIdAndPopulate = async (id: string) =>
    await ChatModel.findById(id).populate('users').populate('messages')
