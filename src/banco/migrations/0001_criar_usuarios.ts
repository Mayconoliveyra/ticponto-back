import { Knex } from 'knex';

import { Util } from '../../util';
import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.usuarios, (table) => {
      table.increments('id').primary().notNullable();
      table.string('nome', 255).notNullable();
      table.string('email', 255).unique().notNullable();
      table.boolean('ativo').defaultTo(true);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at').nullable();
    })
    .then(() => {
      Util.log.info(`# Criado tabela ${ETableNames.usuarios}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.usuarios).then(() => {
    Util.log.info(`# Excluído tabela ${ETableNames.usuarios}`);
  });
}
