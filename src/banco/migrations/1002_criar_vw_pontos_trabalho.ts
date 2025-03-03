import { Knex } from 'knex';

import { Util } from '../../util';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE VIEW vw_pontos_trabalho AS
    SELECT 
        pb.ponto_id,
        pb.usuario_id,
        pb.data,

        -- Cálculo dos períodos individuais
        IF(pb.entrada_1 IS NOT NULL AND pb.saida_1 IS NOT NULL, TIMEDIFF(pb.saida_1, pb.entrada_1), '00:00:00') AS periodo_1,
        IF(pb.entrada_2 IS NOT NULL AND pb.saida_2 IS NOT NULL, TIMEDIFF(pb.saida_2, pb.entrada_2), '00:00:00') AS periodo_2,
        IF(pb.extra_entrada IS NOT NULL AND pb.extra_saida IS NOT NULL, TIMEDIFF(pb.extra_saida, pb.extra_entrada), '00:00:00') AS periodo_extra,

        -- Total trabalhado no dia
        SEC_TO_TIME(
            COALESCE(TIME_TO_SEC(TIMEDIFF(pb.saida_1, pb.entrada_1)), 0) +
            COALESCE(TIME_TO_SEC(TIMEDIFF(pb.saida_2, pb.entrada_2)), 0) +
            COALESCE(TIME_TO_SEC(TIMEDIFF(pb.extra_saida, pb.extra_entrada)), 0)
        ) AS total_trabalhado,

        -- Total esperado de trabalho no dia
        SEC_TO_TIME(
            COALESCE(TIME_TO_SEC(TIMEDIFF(pb.esperado_saida_1, pb.esperado_inicio_1)), 0) +
            COALESCE(TIME_TO_SEC(TIMEDIFF(pb.esperado_saida_2, pb.esperado_inicio_2)), 0)
        ) AS total_esperado

    FROM vw_pontos_base pb;
  `);

  Util.log.info(`# Criado view vw_pontos_trabalho`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS vw_pontos_trabalho;`);
}
