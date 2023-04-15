import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BuildingEntity } from "src/entity/building.entity";
import { MapEntity } from "src/entity/map.entity";
import { MapModule } from "src/map/map.module";
import { BuildingController } from "./building.controller";
import { BuildingService } from "./building.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([BuildingEntity, MapEntity]),
        MapModule
    ],
    controllers: [BuildingController],
    providers: [BuildingService],
    exports: [BuildingService]
})
export class BuildingModule{

}