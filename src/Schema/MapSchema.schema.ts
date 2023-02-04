import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type MapDocument = Map & Document;
@Schema()
export class Map {
    @Prop()
    picrture: string;
    @Prop()
    floorNumbers: number;
    @Prop()
    roomNumber: number;
}
export const MapSchema = SchemaFactory.createForClass(Map);