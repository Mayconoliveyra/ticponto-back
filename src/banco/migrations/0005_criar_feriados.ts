import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.feriados, (table) => {
    table.increments('id').primary();
    table.date('data').notNullable().unique();
    table.string('descricao', 255).notNullable();
    table.boolean('nacional').defaultTo(false); // Identifica se é feriado nacional

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(ETableNames.feriados);
}
