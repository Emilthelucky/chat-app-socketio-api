import express from 'express'
import userRouter from './user'
import me from './me'
import chat from './chat'
import message from './message'

const router = express.Router()

router.use('/user', userRouter)
router.use('/me', me)
router.use('/chat', chat)
router.use('/message', message)

export default router
