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
            p.entrada_1,
            p.saida_1,
            p.entrada_2,
            p.saida_2,
            p.extra_entrada,
            p.extra_saida,
            
            -- Cálculo dos períodos individuais, tratando NULL
            IF(p.entrada_1 IS NOT NULL AND p.saida_1 IS NOT NULL, TIMEDIFF(p.saida_1, p.entrada_1), '00:00:00') AS periodo_1,
            IF(p.entrada_2 IS NOT NULL AND p.saida_2 IS NOT NULL, TIMEDIFF(p.saida_2, p.entrada_2), '00:00:00') AS periodo_2,
            IF(p.extra_entrada IS NOT NULL AND p.extra_saida IS NOT NULL, TIMEDIFF(p.extra_saida, p.extra_entrada), '00:00:00') AS periodo_extra,
            
            -- Cálculo do total trabalhado no dia
            SEC_TO_TIME(
                COALESCE(TIME_TO_SEC(TIMEDIFF(p.saida_1, p.entrada_1)), 0) +
                COALESCE(TIME_TO_SEC(TIMEDIFF(p.saida_2, p.entrada_2)), 0) +
                COALESCE(TIME_TO_SEC(TIMEDIFF(p.extra_saida, p.extra_entrada)), 0)
            ) AS total_trabalhado,

            -- Cálculo do saldo anterior (soma de todas as horas trabalhadas antes do dia atual)
            (SELECT SEC_TO_TIME(SUM(
                COALESCE(TIME_TO_SEC(TIMEDIFF(px.saida_1, px.entrada_1)), 0) +
                COALESCE(TIME_TO_SEC(TIMEDIFF(px.saida_2, px.entrada_2)), 0) +
                COALESCE(TIME_TO_SEC(TIMEDIFF(px.extra_saida, px.extra_entrada)), 0)
            )) 
            FROM pontos px
            WHERE px.usuario_id = p.usuario_id AND px.data < p.data) AS saldo_anterior,

            p.created_at,
            p.updated_at,
            p.deleted_at
        FROM pontos p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.deleted_at IS NULL;
      `);

  Util.log.info(`# Criado view ${ETableNames.vw_pontos}`);
}

/**
 * Rollback da criação da view.
 */
export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS ${ETableNames.vw_pontos};`);
}
