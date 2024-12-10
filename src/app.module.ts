import { Module } from '@nestjs/common';
import { ProdutoModule } from './produto/produto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigService } from './config/db.config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsuarioModule, 
    ProdutoModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: DbConfigService, inject: [DbConfigService] }),
  ],
})
export class AppModule {}
