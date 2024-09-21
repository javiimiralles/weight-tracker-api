import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/jwt.middleware.js';
import { validateFields } from '../middleware/fields.middleware.js';
import { getWeightRecords, getWeightRecordById, createWeightRecord, updateWeightRecord, deleteWeightRecord } from '../controllers/weight-records.controller.js';

const router= Router();

router.get('/', [
    validateJWT,
    check('userId','El userId no es válido').isMongoId(),
    check('offset','El argumento offset debe ser un numérico').optional().isNumeric(),
    check('limit','El argumento limit debe ser un numérico').optional().isNumeric(),
    check('startDate','El argumento startDate debe ser una fecha').optional().isDate(),
    check('endDate','El argumento startDate debe ser una fecha').optional().isDate(),
    validateFields
], getWeightRecords)

router.get('/:id', [
    validateJWT,
    check('id','El identificador no es válido').isMongoId(),
    validateFields
], getWeightRecordById)

router.post('/', [
    validateJWT,
    check('date', 'La fecha es obligatoria').trim().notEmpty(),
    check('date', 'El formato de la fecha es incorrecto').isDate(),
    check('weight', 'El peso es obligatorio').trim().notEmpty(),
    check('user','El id del usuario no es válido').isMongoId(),
    validateFields
], createWeightRecord)

router.put('/:id', [
    validateJWT,
    check('date', 'La fecha es obligatoria').trim().notEmpty(),
    check('date', 'El formato de la fecha es incorrecto').isDate(),
    check('weight', 'El peso es obligatorio').trim().notEmpty(),
    validateFields
], updateWeightRecord)

router.delete('/:id', [
    validateJWT,
    check('id','El identificador no es válido').isMongoId(),
    validateFields
], deleteWeightRecord)

export default router;