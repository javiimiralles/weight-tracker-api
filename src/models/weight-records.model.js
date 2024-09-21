import { Schema, model } from 'mongoose';

const WeightRecordSchema = Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        weight: {
            type: Number,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        } 
    }, { collection: 'users' }
)

WeightRecordSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
});

export default model('WeightRecord', WeightRecordSchema);