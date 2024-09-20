import { response } from 'express';
import { GenderEnum } from '../enums/gender.enum.js';
import { HttpStatusCodeEnum } from '../enums/http-status-code.enum.js';

export const validateGender = (req, res = response, next) => {
    const gender = req.body.gender;

    if(!gender || !Object.values(GenderEnum).includes(gender)) {
        return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
            ok: false,
            error:'Género inválido'
        });
    }
    next();
}