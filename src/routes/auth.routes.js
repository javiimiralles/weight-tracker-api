import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middleware/fields.middleware.js';
import { login, renewToken } from '../controllers/auth.controller.js';

const router = Router();

router.get('/token', [
    check('x-token', 'El argumento x-token es obligatorio').trim().notEmpty(),
    validateFields,
], renewToken);

router.post('/', [
    check('password', 'La contraseña es obligatoria').trim().notEmpty(),
    check('username', 'El nombre de usuario es obligatorio').trim().notEmpty(),
    validateFields,
], login);

export default router;