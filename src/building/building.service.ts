import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatGateway } from "src/Gateway/chat.gateway";
import { CreateBuildingDto } from "src/dto/building-dto";
import { CreateMapDto } from "src/dto/map-dto";
import { BuildingEntity } from "src/entity/building.entity";
import { MapEntity } from "src/entity/map.entity";
import { MapService } from "src/map/map.service";
import { Repository } from "typeorm";

@Injectable()
export class BuildingService {
    constructor(
        @InjectRepository(BuildingEntity)    
        private readonly buildingRepo: Repository<BuildingEntity>, 
        @InjectRepository(MapEntity) private readonly mapRepo: Repository<MapEntity>, private readonly mapService: MapService,
        private readonly chatGateway: ChatGateway) {}

    async createBuilding(buildingDto: CreateBuildingDto): Promise<BuildingEntity> {    
        const { description, buildingName, streetName, cityName } = buildingDto;

        const buidlingInDb = await this.buildingRepo.findOne({ 
            where: { buildingName } 
        });

        if (buidlingInDb) {
            throw new HttpException('Budiling already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const building: BuildingEntity = await this.buildingRepo.create({ description, buildingName, streetName, cityName });
        await this.buildingRepo.save(building);
        this.chatGateway.sendInfo("building with name: " + buildingName + ", street name: " + streetName + ", city name: " + cityName + " and description: " + description);
        return building;  
    }

    async getAll(): Promise<BuildingEntity[]> {
        return this.buildingRepo.find();
    }

    async addMap(dto: CreateMapDto, imageBuffer: Buffer, filename: string): Promise<BuildingEntity> {
        const map = await this.mapService.createMap(dto, imageBuffer, filename);
        const buildingName =  map.buildingName;
        const building = await this.buildingRepo.findOne( {where: { buildingName} });
        map.building = building;
        this.mapRepo.save(map);
        return building;
    }

    async getOne(id: string): Promise<BuildingEntity> {
        
        return await this.buildingRepo.findOne({
            where: {
                id
            },
            relations: {
                maps: true,
            },
        })
    }

    async delete(id: string): Promise<void> {
        await this.buildingRepo.delete({id});
    }
}