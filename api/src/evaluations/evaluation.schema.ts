import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Evaluation extends Document {
    @Prop({ required: true })
    studentId: string;

    @Prop({ required: true })
    studentName: string;

    @Prop({ required: true })
    formation: string;

    @Prop({ required: true })
    dateEntretien: Date;

    @Prop({ required: true })
    heureEntretien: string;

    @Prop({ required: true })
    chargeAdmission: string;

    @Prop({
        type: {
            critere1: { type: Number, required: true, min: 1, max: 5 },
            critere2: { type: Number, required: true, min: 1, max: 5 },
            critere3: { type: Number, required: true, min: 1, max: 5 },
            critere4: { type: Number, required: true, min: 1, max: 5 }
        },
        required: true
    })
    scores: {
        critere1: number;
        critere2: number;
        critere3: number;
        critere4: number;
    };

    @Prop({ required: true })
    totalScore: number;

    @Prop({ required: true })
    appreciation: string;

    @Prop({ default: '' })
    commentaires: string;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);

// Index for faster queries
EvaluationSchema.index({ studentId: 1 });
