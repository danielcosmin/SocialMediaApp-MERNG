const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User')
const { validate } = require('graphql')

function generateToke(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    },
        SECRET_KEY,
        { expiresIn: '24h' }
    )
}


module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password)

            if (!valid) {
                throw new UserInputError('Errors', { errors })

            }

            const user = await User.findOne({ username })
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToke(user)
            return {
                ...user._doc,
                id: user._id,
                token
            }

        },
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            },
        ) {
            // Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            // Make sure the user doesn't exist already
            const user = await User.findOne({ username })
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            // hash pass ands creat an auth token
            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const response = await newUser.save()

            const token = generateToke(response)
            return {
                ...response._doc,
                id: response._id,
                token
            }
        }
    }
}

