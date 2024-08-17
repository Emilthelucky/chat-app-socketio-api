import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
config()

const JWT_SECRET = process.env.JWT_SECRET

export const salt = () => {
    const salt = bcrypt.genSalt(12)
    return salt
}

export const hashPassword = (password: string, salt: string) => {
    return bcrypt.hash(password, salt)
}

export const comparePassword = (
    userInputPassword: string,
    password: string
) => {
    return bcrypt.compare(userInputPassword, password)
}
