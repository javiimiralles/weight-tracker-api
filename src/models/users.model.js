import { Schema, model } from 'mongoose';
import { GenderEnum } from '../enums/gender.enum.js';

const UserSchema = Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: Object.values(GenderEnum)
        },
        height: {
            type: Number,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        targetWeight: {
            type: Number,
            required: true
        }
    }, { collection: 'users' }
)

UserSchema.method('toJSON', function(){
    const { __v, password, ...object } = this.toObject();
    return object;
});

export default model('User', UserSchema);