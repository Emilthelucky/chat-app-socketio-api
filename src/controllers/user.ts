import express from 'express'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getUserByEmail, UserModel } from '../models/user'
import { comparePassword, hashPassword, salt } from '../helpers'

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.status(400)
        }

        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return res.status(400).json({
                message: 'USER_EXISTS',
            })
        }

        const generatedSalt = await salt()
        const hashedPassword = await hashPassword(password, generatedSalt)

        const user = await UserModel.create({
            username,
            email,
            authentication: {
                salt: generatedSalt,
                password: hashedPassword,
            },
        })

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(400)
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'INVALID_INPUTS',
            })
        }

        const user = await getUserByEmail(email).select(
            '+authentication.salt +authentication.password'
        )

        if (!user) {
            return res.status(400)
        }

        const checkPassword = await comparePassword(
            password,
            user.authentication.password
        )

        if (!checkPassword) {
            return res.status(400).json({
                message: 'INCORRECT_PASSWORD',
            })
        }

        user.authentication.sessionToken = uuidv4()

        await user.save()

        res.cookie('AUTH', user.authentication.sessionToken, {
            domain: 'localhost',
            path: '/',
        })

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}
