import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.usuarios, (table) => {
      table.increments('id').primary().notNullable();

      table.string('nome', 120).notNullable();
      table.string('email', 120).unique().notNullable();
      table.string('senha', 255).notNullable();
      table.string('contato', 13).nullable();
      table.date('nascimento').nullable();
      table.boolean('notificar').defaultTo(true);
      table.boolean('ativo').defaultTo(true);
      table.boolean('administrador').defaultTo(false);

      table.integer('empresa_id').notNullable().unsigned().references('id').inTable(ETableNames.empresas);

      const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

      dias.forEach((dia) => {
        table.time(`${dia}_inicio_1`).nullable();
        table.time(`${dia}_saida_1`).nullable();
        table.time(`${dia}_inicio_2`).nullable();
        table.time(`${dia}_saida_2`).nullable();
      });

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at').nullable();
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.usuarios}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.usuarios).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.usuarios}`);
  });
}
