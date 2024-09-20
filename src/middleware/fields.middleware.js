import { response } from 'express';
import { validationResult } from 'express-validator';
import { HttpStatusCodeEnum } from '../enums/http-status-code.enum.js';

export const validateFields = (req, res = response, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
            ok: false,
            error: errors.mapped()
        });
    }
    next();
}