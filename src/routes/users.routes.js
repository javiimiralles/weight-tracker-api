import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/jwt.middleware.js';
import { validateGender } from '../middleware/gender.middleware.js';
import { validateFields } from '../middleware/fields.middleware.js';
import { createUser, updateUser, updatePassword, deleteUser } from '../controllers/users.controller.js';

const router= Router();

router.post('/', [
    check('email', 'El email es obligatorio').trim().notEmpty(),
    check('email', 'El email es no tiene el formato correcto').isEmail(),
    check('username', 'El nombre de usuario es obligatorio').trim().notEmpty(),
    check('password', 'La contraseña es obligatoria').trim().notEmpty(),
    check('gender','Se debe indicar el género').trim().notEmpty(),
    check('height','Se debe indicar la altura').trim().notEmpty(),
    check('age','Se debe indicar la edad').trim().notEmpty(),
    check('targetWeight','Se debe indicar el peso objetivo').trim().notEmpty(),
    validateFields,
    validateGender
], createUser)

router.put('/:id', [
    validateJWT,
    check('id','El identificador no es válido').isMongoId(),
    check('email', 'El email es obligatorio').trim().notEmpty(),
    check('email', 'El email es no tiene el formato correcto').isEmail(),
    check('username', 'El nombre de usuario es obligatorio').trim().notEmpty(),
    check('gender','Se debe indicar el género').trim().notEmpty(),
    check('height','Se debe indicar la altura').trim().notEmpty(),
    check('age','Se debe indicar la edad').trim().notEmpty(),
    check('targetWeight','Se debe indicar el peso objetivo').trim().notEmpty(),
    validateFields,
    validateGender
], updateUser)

router.put('/change-password/:id', [
    validateJWT,
    check('currentPassword', 'La antigua contraseña es obligatoria').trim().notEmpty(),
    check('newPassword', 'La nueva contraseña es obligatoria').trim().notEmpty(),
    check('confirmPassword', 'La nueva contraseña repetida es obligatoria').trim().notEmpty(),
    validateFields
], updatePassword)

router.delete('/:id', [
    validateJWT,
    check('id','El identificador no es válido').isMongoId(),
    validateFields
], deleteUser)

export default router;