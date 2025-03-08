import { Knex } from 'knex';

import { Util } from '../../util';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE VIEW vw_pontos_base AS
    SELECT  
        p.id AS ponto_id,
        p.usuario_id,
        u.nome AS usuario_nome,
        p.data,
        p.entrada_1, p.saida_1, p.entrada_2, p.saida_2,
        p.extra_entrada, p.extra_saida,
        p.esperado_inicio_1, p.esperado_saida_1, 
        p.esperado_inicio_2, p.esperado_saida_2
    FROM pontos p
    JOIN usuarios u ON p.usuario_id = u.id;
  `);

  Util.Log.info(`# Criado view vw_pontos_base`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS vw_pontos_base;`);
}
