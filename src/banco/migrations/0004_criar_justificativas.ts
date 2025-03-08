import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(ETableNames.justificativas, (table) => {
    table.increments('id').primary();
    table.integer('usuario_id').unsigned().notNullable().references('id').inTable(ETableNames.usuarios).onDelete('CASCADE');
    table.date('data').notNullable();
    table.string('motivo', 255).notNullable();
    table.string('anexo', 255).nullable(); // Caso tenha um comprovante anexado

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable();
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(ETableNames.justificativas);
}
