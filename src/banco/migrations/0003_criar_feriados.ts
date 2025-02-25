import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.feriados, (table) => {
      table.increments('id').primary().notNullable();
      table.date('data').notNullable().unique();
      table.string('descricao', 255).notNullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at').nullable();
    })
    .then(() => {
      Util.log.info(`# Criado tabela ${ETableNames.feriados}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.feriados).then(() => {
    Util.log.info(`# Excluído tabela ${ETableNames.feriados}`);
  });
}
