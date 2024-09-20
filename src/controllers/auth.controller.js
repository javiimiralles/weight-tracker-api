import { response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateJWT } from '../utils/jwt.utils.js';
import User from '../models/users.model.js';
import { HttpStatusCodeEnum } from '../enums/http-status-code.enum.js';

export const login = async(req, res = response) => {

    const { username, password } = req.body;

    try {

        const userDB = await User.findOne({ username });
        if (!userDB) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const { _id } = userDB;
        const token = await generateJWT(_id);

        // OK -> login correcto
        res.json({
            ok: true,
            msg: 'Login correcto',
            uid: _id,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno',
            token: ''
        });
    }
}

export const renewToken = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const userDB = await User.findById(uid);

        if(!userDB) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
                ok: false,
                msg: 'El token no es válido',
                token: ''
            });
        }

        const newToken = await generateJWT(uid);

        // OK -> token creado
        res.json({
            ok: true,
            msg: 'Token renovado',
            _id: uid,
            username: userDB.username,
            gender: userDB.gender,
            height: userDB.height,
            age: userDB.age,
            targetWeight: userDB.targetWeight,
            token: newToken
        });

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno',
            token: ''
        });
    }
}