import { Knex } from 'knex';

import { Util } from '../../util';
import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.pontos, (table) => {
      table.increments('id').primary().notNullable();
      table.integer('usuario_id').notNullable().unsigned().references('id').inTable(ETableNames.usuarios);
      table.enu('tipo', ['ENTRADA', 'SAIDA']).notNullable();
      table.datetime('horario').notNullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at').nullable();
    })
    .then(() => {
      Util.log.info(`# Criado tabela ${ETableNames.pontos}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.pontos).then(() => {
    Util.log.info(`# Excluído tabela ${ETableNames.pontos}`);
  });
}
