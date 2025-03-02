import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

/**
 * Migration de criação da view.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE VIEW vw_pontos AS
        SELECT 
            p.id AS ponto_id,
            p.usuario_id,
            u.nome AS usuario_nome,
            p.data,

            -- Registros de ponto
            p.entrada_1,
            p.saida_1,
            p.entrada_2,
            p.saida_2,
            p.extra_entrada,
            p.extra_saida,

            -- Horários esperados
            p.esperado_inicio_1,
            p.esperado_saida_1,
            p.esperado_inicio_2,
            p.esperado_saida_2,

            -- Cálculo dos períodos individuais
            IF(p.entrada_1 IS NOT NULL AND p.saida_1 IS NOT NULL, TIMEDIFF(p.saida_1, p.entrada_1), '00:00:00') AS periodo_1,
            IF(p.entrada_2 IS NOT NULL AND p.saida_2 IS NOT NULL, TIMEDIFF(p.saida_2, p.entrada_2), '00:00:00') AS periodo_2,
            IF(p.extra_entrada IS NOT NULL AND p.extra_saida IS NOT NULL, TIMEDIFF(p.extra_saida, p.extra_entrada), '00:00:00') AS periodo_extra,

            -- Total trabalhado no dia (somente até a data atual)
            IF(p.data <= CURDATE(),
                SEC_TO_TIME(
                    COALESCE(TIME_TO_SEC(TIMEDIFF(p.saida_1, p.entrada_1)), 0) +
                    COALESCE(TIME_TO_SEC(TIMEDIFF(p.saida_2, p.entrada_2)), 0) +
                    COALESCE(TIME_TO_SEC(TIMEDIFF(p.extra_saida, p.extra_entrada)), 0)
                ),
                NULL
            ) AS total_trabalhado,

            -- Total esperado de trabalho no dia (somente até a data atual)
            IF(p.data <= CURDATE(),
                SEC_TO_TIME(
                    COALESCE(TIME_TO_SEC(TIMEDIFF(p.esperado_saida_1, p.esperado_inicio_1)), 0) +
                    COALESCE(TIME_TO_SEC(TIMEDIFF(p.esperado_saida_2, p.esperado_inicio_2)), 0)
                ),
                NULL
            ) AS total_esperado,

            -- Saldo do dia: diferença entre trabalhado e esperado (somente até a data atual)
            IF(p.data <= CURDATE(),
                SEC_TO_TIME(
                    (COALESCE(TIME_TO_SEC(TIMEDIFF(p.saida_1, p.entrada_1)), 0) +
                    COALESCE(TIME_TO_SEC(TIMEDIFF(p.saida_2, p.entrada_2)), 0) +
                    COALESCE(TIME_TO_SEC(TIMEDIFF(p.extra_saida, p.extra_entrada)), 0)) -
                    (COALESCE(TIME_TO_SEC(TIMEDIFF(p.esperado_saida_1, p.esperado_inicio_1)), 0) +
                    COALESCE(TIME_TO_SEC(TIMEDIFF(p.esperado_saida_2, p.esperado_inicio_2)), 0))
                ),
                NULL
            ) AS saldo_dia,

            -- Saldo acumulado até a data atual (soma dos saldos anteriores e do dia atual, ignorando futuros)
            IF(p.data <= CURDATE(),
                (SELECT SEC_TO_TIME(
                    SUM(
                        (COALESCE(TIME_TO_SEC(TIMEDIFF(px.saida_1, px.entrada_1)), 0) +
                        COALESCE(TIME_TO_SEC(TIMEDIFF(px.saida_2, px.entrada_2)), 0) +
                        COALESCE(TIME_TO_SEC(TIMEDIFF(px.extra_saida, px.extra_entrada)), 0)) -
                        (COALESCE(TIME_TO_SEC(TIMEDIFF(px.esperado_saida_1, px.esperado_inicio_1)), 0) +
                        COALESCE(TIME_TO_SEC(TIMEDIFF(px.esperado_saida_2, px.esperado_inicio_2)), 0))
                    )
                )
                FROM pontos px
                WHERE px.usuario_id = p.usuario_id AND px.data <= CURDATE() AND px.data <= p.data),
                NULL
            ) AS saldo_acumulado,

            p.created_at,
            p.updated_at,
            p.deleted_at
        FROM pontos p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.deleted_at IS NULL
        ORDER BY p.usuario_id, p.data ASC;

      `);

  Util.log.info(`# Criado view ${ETableNames.vw_pontos}`);
}

/**
 * Rollback da criação da view.
 */
export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS ${ETableNames.vw_pontos};`);
}
