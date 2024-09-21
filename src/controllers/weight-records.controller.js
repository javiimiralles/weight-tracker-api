import { response } from 'express';
import User from '../models/users.model.js';
import WeightRecord from '../models/weight-records.model.js';
import { HttpStatusCodeEnum } from '../enums/http-status-code.enum.js';

export const getWeightRecords = async(req, res = response) => {
    const userId = req.query.userId;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || Number(process.env.DOCS_PER_PAGE);
    const startDate = !isNaN(Date.parse(req.query.startDate)) ? new Date(req.query.startDate) : null;
    const endDate = !isNaN(Date.parse(req.query.endDate)) ? new Date(req.query.endDate) : null;

    try {

        const user = await User.findById(userId);
    
        if (!user) {
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok: false,
                msg: `No existe ningún usuario con el id ${userId}`
            });
        }

        let filter = { user: userId };

        if(startDate && endDate) {
            startDate.setHours(0, 0, 0);
            endDate.setHours(23, 59, 59);
            filter.date = { $gte: startDate, $lte: endDate };
        } else if(startDate) {
            startDate.setHours(0, 0, 0);
            filter.date = { $gte: startDate };
        } else if(endDate) {
            endDate.setHours(23, 59, 59);
            filter.date = { $lte: endDate };
        }

        const weightRecords = await WeightRecord.find(filter).sort({ date: -1 }).skip(offset).limit(limit);

        //OK
        res.json({
            ok: true,
            msg: 'Registros de peso obtenidos',
            weightRecords
        })

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno'
        });
    }
}

export const getWeightRecordById = async(req, res = response) => {

    const id = req.params.id;

    try {

        const weightRecord = await WeightRecord.findById(id);

        if (!weightRecord) {
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok: false,
                msg: `No existe ningún registro de peso con el id ${id}`
            });
        }

        res.json({
            ok: true,
            msg: 'Registro de peso obtenido',
            weightRecord
        });

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno'
        });
    }
}

export const createWeightRecord = async(req, res = response) => {

    const { user, ...object } = req.body;

    try {

        const userDB = await User.findById(user);
        if (!userDB) {
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok: false,
                msg: `No existe ningún usuario con el id ${user}`
            });
        }

        object.user = user;
        const weightRecord = new WeightRecord(object);

        await weightRecord.save();

        //OK
        res.json({
            ok: true,
            msg: 'Registro de peso creado',
            weightRecord
        })

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno'
        });
    }

}

export const updateWeightRecord = async(req, res = response) => {

    const { user, ...object } = req.body;
    const id = req.params.id;

    try {

        const weightRecordDB = await WeightRecord.findById(id);
        if (!weightRecordDB) {
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok: false,
                msg: `No existe ningún registro de peso con el id ${id}`
            });
        }

        const userDB = await User.findById(user);
        if (!userDB) {
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok: false,
                msg: `No existe ningún usuario con el id ${user}`
            });
        }

        object.user = user;
        const weightRecord = await WeightRecord.findByIdAndUpdate(id, object, { new: true });

        //OK
        res.json({
            ok: true,
            msg: 'Registro de peso actualizado',
            weightRecord
        })

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno'
        });
    }
}

export const deleteWeightRecord = async(req, res = response) => {

    const id = req.params.id;

    try {

        const weightRecord = await WeightRecord.findByIdAndDelete(id);

        if (!weightRecord) {
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({
                ok: false,
                msg: `No existe ningún registro de peso con el id ${id}`
            });
        }

        //OK
        res.json({
            ok: true,
            msg: 'Registro de peso eliminado',
            weightRecord
        })

    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
            ok: false,
            msg: 'Error interno'
        });
    }
}