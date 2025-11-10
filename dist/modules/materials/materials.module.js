"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const material_schema_1 = require("../../common/schemas/material.schema");
const projects_schema_1 = require("../../common/schemas/projects.schema");
const materials_service_1 = require("./materials.service");
const materials_controller_1 = require("./materials.controller");
let MaterialsModule = class MaterialsModule {
};
exports.MaterialsModule = MaterialsModule;
exports.MaterialsModule = MaterialsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: material_schema_1.Material.name, schema: material_schema_1.MaterialSchema },
                { name: projects_schema_1.Project.name, schema: projects_schema_1.ProjectSchema }
            ])
        ],
        controllers: [materials_controller_1.MaterialsController],
        providers: [materials_service_1.MaterialsService],
    })
], MaterialsModule);
