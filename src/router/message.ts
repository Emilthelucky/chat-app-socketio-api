import { createMessage } from '../controllers/message'
import express from 'express'

const message = express.Router()

message.post('/create', createMessage)

export default message
