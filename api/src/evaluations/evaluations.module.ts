import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from './evaluation.schema';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Evaluation.name, schema: EvaluationSchema }
        ])
    ],
    controllers: [EvaluationsController],
    providers: [EvaluationsService],
    exports: [EvaluationsService]
})
export class EvaluationsModule { }
