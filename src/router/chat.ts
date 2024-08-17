import { getOrCreateChat } from '../controllers/chat'
import express from 'express'

const chat = express.Router()

chat.post('/get', getOrCreateChat)

export default chat
