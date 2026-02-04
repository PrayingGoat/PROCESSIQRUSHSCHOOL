import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { EvaluationsService, CreateEvaluationDto } from './evaluations.service';

@Controller('evaluations')
export class EvaluationsController {
    constructor(private readonly evaluationsService: EvaluationsService) { }

    @Post()
    async create(@Body() createDto: CreateEvaluationDto) {
        return await this.evaluationsService.create(createDto);
    }

    @Get()
    async findAll() {
        return await this.evaluationsService.findAll();
    }

    @Get(':studentId')
    async findOne(@Param('studentId') studentId: string) {
        return await this.evaluationsService.findByStudentId(studentId);
    }

    @Put(':studentId')
    async update(
        @Param('studentId') studentId: string,
        @Body() updateDto: CreateEvaluationDto
    ) {
        return await this.evaluationsService.updateByStudentId(studentId, updateDto);
    }
}
