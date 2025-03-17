import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";
import { TypegooseModuleOptions } from "nestjs-typegoose";

export const getMongoDBConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>("MONGO_URI");
  return { uri };
};
