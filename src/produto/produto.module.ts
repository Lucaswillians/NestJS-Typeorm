import { Module } from '@nestjs/common';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ProdutoController } from './produto.controller';
import { ProdutoRepository } from './produto.repository';
import { ProdutoService } from './produto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoEntity } from './produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutoEntity])],
  controllers: [ProdutoController],
  providers: [ProdutoRepository, ProdutoService],
})
export class ProdutoModule {}
