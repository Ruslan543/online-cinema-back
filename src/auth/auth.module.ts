import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserSchema, User } from "../user/user.model";
// import { TypegooseModule } from "nestjs-typegoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { getJWTConfig } from "src/config/jwt.config";
import { JwtStrategy } from "./strategies/jwt.strategy";

// TypegooseModule.forFeature([
//   { typegooseClass: UserModel, schemaOptions: { collection: "User" } },
// ]),

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
