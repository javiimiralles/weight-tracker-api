import jwt from 'jsonwebtoken';
import { HttpStatusCodeEnum } from '../enums/http-status-code.enum.js';

export const validateJWT = (req, res, next) => {

    const token = req.header('x-token') || req.query.token;

    if (!token) {
        return res.status(HttpStatusCodeEnum.UNAUTHORIZED).json({
            ok: false,
            msg: 'Falta el token de autorización'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uidToken = uid;
        next();

    } catch (err) {
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}