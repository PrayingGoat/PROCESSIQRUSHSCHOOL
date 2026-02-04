import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evaluation } from './evaluation.schema';

export interface CreateEvaluationDto {
    studentId: string;
    studentName: string;
    formation: string;
    dateEntretien: string;
    heureEntretien: string;
    chargeAdmission: string;
    critere1: number;
    critere2: number;
    critere3: number;
    critere4: number;
    commentaires?: string;
}

@Injectable()
export class EvaluationsService {
    constructor(
        @InjectModel(Evaluation.name) private evaluationModel: Model<Evaluation>
    ) { }

    private calculateAppreciation(score: number): string {
        if (score <= 8) return 'Insuffisant';
        if (score <= 12) return 'Passable';
        if (score <= 16) return 'Satisfaisant';
        return 'Excellent';
    }

    async create(createDto: CreateEvaluationDto): Promise<Evaluation> {
        const totalScore = createDto.critere1 + createDto.critere2 + createDto.critere3 + createDto.critere4;
        const appreciation = this.calculateAppreciation(totalScore);

        const evaluation = new this.evaluationModel({
            studentId: createDto.studentId,
            studentName: createDto.studentName,
            formation: createDto.formation,
            dateEntretien: new Date(createDto.dateEntretien),
            heureEntretien: createDto.heureEntretien,
            chargeAdmission: createDto.chargeAdmission,
            scores: {
                critere1: createDto.critere1,
                critere2: createDto.critere2,
                critere3: createDto.critere3,
                critere4: createDto.critere4
            },
            totalScore,
            appreciation,
            commentaires: createDto.commentaires || ''
        });

        return await evaluation.save();
    }

    async findByStudentId(studentId: string): Promise<Evaluation | null> {
        return await this.evaluationModel.findOne({ studentId }).exec();
    }

    async findAll(): Promise<Evaluation[]> {
        return await this.evaluationModel.find().sort({ createdAt: -1 }).exec();
    }

    async updateByStudentId(
        studentId: string,
        updateDto: CreateEvaluationDto
    ): Promise<Evaluation | null> {
        const totalScore = updateDto.critere1 + updateDto.critere2 + updateDto.critere3 + updateDto.critere4;
        const appreciation = this.calculateAppreciation(totalScore);

        return await this.evaluationModel.findOneAndUpdate(
            { studentId },
            {
                studentName: updateDto.studentName,
                formation: updateDto.formation,
                dateEntretien: new Date(updateDto.dateEntretien),
                heureEntretien: updateDto.heureEntretien,
                chargeAdmission: updateDto.chargeAdmission,
                scores: {
                    critere1: updateDto.critere1,
                    critere2: updateDto.critere2,
                    critere3: updateDto.critere3,
                    critere4: updateDto.critere4
                },
                totalScore,
                appreciation,
                commentaires: updateDto.commentaires || ''
            },
            { new: true }
        ).exec();
    }
}
