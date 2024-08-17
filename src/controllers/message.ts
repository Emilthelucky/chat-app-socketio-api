import { Request, Response } from 'express'
import { MessageModel } from '../models/message'
import { getChatByIdAndPopulate } from '../models/chat'
import { io } from '../index'

export const createMessage = async (req: Request, res: Response) => {
    const { message, userId, id } = req.body

    const newMessage = await MessageModel.create({
        message,
        user: userId,
    })

    const chat = await getChatByIdAndPopulate(id)
    chat.messages.push(newMessage._id)
    await chat.save()

    const populatedChat = await chat.populate('messages')

    const chatUsers = chat.users.map((user) => user._id.toString())
    chatUsers.forEach((userId) => {
        io.to(userId).emit('newMessage', populatedChat)
    })

    return res.status(200).json(populatedChat)
}
