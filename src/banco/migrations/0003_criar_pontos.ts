import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.pontos, (table) => {
      table.increments('id').primary().notNullable();
      table.integer('usuario_id').notNullable().unsigned().references('id').inTable(ETableNames.usuarios);
      table.date('data').notNullable();

      // Turno esperado
      table.time('esperado_inicio_1').nullable();
      table.time('esperado_saida_1').nullable();
      table.time('esperado_inicio_2').nullable();
      table.time('esperado_saida_2').nullable();

      // Turnos normais
      table.time('entrada_1').nullable();
      table.time('saida_1').nullable();
      table.time('entrada_2').nullable();
      table.time('saida_2').nullable();

      // Horas Extras
      table.time('extra_entrada').nullable();
      table.time('extra_saida').nullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));

      table.unique(['usuario_id', 'data']); // Garantir que só tenha um registro por dia
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.pontos}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.pontos).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.pontos}`);
  });
}
