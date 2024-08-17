import { Request, Response } from 'express'
import { ChatModel } from '../models/chat'
import { io } from '../index'

export const getOrCreateChat = async (req: Request, res: Response) => {
    const { firstUserId, secondUserId } = req.body

    const chat = await ChatModel.findOne({
        users: { $all: [firstUserId, secondUserId] },
    })
        .populate('users')
        .populate('messages')

    if (chat) {
        //socket
        io.to(firstUserId).emit('existingChat', chat)
        io.to(secondUserId).emit('existingChat', chat)

        return res.status(200).json(chat)
    } else {
        const newChat = await ChatModel.create({
            isGroup: false,
            users: [firstUserId, secondUserId],
        })

        const populatedNewChat = await ChatModel.findById(newChat._id)
            .populate('users')
            .populate('messages')

        io.to(firstUserId).emit('newChat', populatedNewChat)
        io.to(secondUserId).emit('newChat', populatedNewChat)

        return res.status(200).json(populatedNewChat)
    }
}
