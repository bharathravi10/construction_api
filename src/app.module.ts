import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { RolesModule } from './modules/role/role.module';
import { UserDetailsModule } from './modules/user-details/user-details.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        // mongoose options can be added here
      }),
    }),
    RolesModule,
    UserDetailsModule,
    AuthModule,
  ],
})
export class AppModule {}
