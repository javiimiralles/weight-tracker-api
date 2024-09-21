import { response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/users.model.js';
import WeightRecord from '../models/weight-records.model.js';
import { HttpStatusCodeEnum } from '../enums/http-status-code.enum.js';

export const createUser = async(req, res = response) => {

    const { username, password } = req.body;

    try{
        const userDB = await User.findOne({ username });

        // KO -> existe un usuario con ese nombre
        if(userDB){
            return  res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
                ok: false,
                msg:"Ya existe un usuario con este nombre"
            })
        }
    
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        const object = req.body;
        const user = new User(object);
        user.password = cpassword;

        await user.save();

        res.json({
            ok:true,
            msg:"Usuario creado",
            user
        });
    }
    catch(error){
        console.error(error);
        return  res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg:'Error interno'
        })
    }
}

export const updateUser = async(req, res = response) => {

    const { password, username, ...object } = req.body;
    const id = req.params.id;

    try {
        let userDB = await User.findById(id);
        if(!userDB){
            return  res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok:false,
                msg: `No existe ningún usuario con el id ${id}`
            })
        }
    
        userDB = await User.findOne({ username });
    
        // KO -> existe un usuario con ese nombre
        if(userDB && userDB._id != id) {
            return  res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
                ok: false,
                msg:"Ya existe un usuario con este nombre"
            });
        }
    
        object.email = email;
        const user = await User.findByIdAndUpdate(id, object, { new: true }); 
    
        res.json({
            ok:true,
            msg:"Usuario actualizado",
            user
        })
    } catch(error){
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg:'Error interno'
        })
    }
}

export const updatePassword = async(req, res = response) => {

    const id = req.params.id;
    const { oldPassword, newPassword, newPassword2 } = req.body;

    try {

        const userDB = await User.findById(id);
        if (!userDB){
            return  res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok:false,
                msg: `No existe ningún usuario con el id ${id}`
            })
        }

        const validPassword = bcrypt.compareSync(oldPassword, userDB.password);

        if (!validPassword) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        if (newPassword !== newPassword2) {
            return  res.status(HttpStatusCodeEnum.BAD_REQUEST).json({
                ok:false,
                msg: "Las contraseñas no coinciden"
            })
        }

        // Si llega aqui las validaciones se han realizado correctamente
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(newPassword, salt);
        userDB.password = cpassword;

        await userDB.save();

        // OK
        res.json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno'
        });
    }

}

export const deleteUser = async(req, res = response) => {
    const uid = req.params.id;

    try {

        let userDB = await User.findById(uid);
        // KO -> no existe el usuario
        if(!userDB){
            return  res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok:false,
                msg:'El usuario no existe'
            })
        }

        const user = await User.findByIdAndDelete(uid);

        // Eliminamos sus registros de peso
        await WeightRecord.deleteMany({ user: uid });

        // OK
        res.json({
            ok:true,
            msg:"Usuario eliminado",
            user
        })

    } catch(error){
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}