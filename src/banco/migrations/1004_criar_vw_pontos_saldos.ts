import { Knex } from 'knex';

import { Util } from '../../util';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE VIEW vw_pontos_saldos AS
    SELECT 
        pt.ponto_id,
        pt.usuario_id,
        pt.data,

        -- Saldo do dia (se for folga, feriado ou tiver justificativa, saldo = NULL)
        IF(
            ps.folga = 1 OR ps.feriado = 1 OR ps.justificativa = 1, 
            NULL, 
            IF(pt.data <= CURDATE(),
                SEC_TO_TIME(
                    TIME_TO_SEC(pt.total_trabalhado) - TIME_TO_SEC(pt.total_esperado)
                ),
                NULL
            )
        ) AS saldo_dia,

        -- Saldo acumulado (ignora folgas, feriados e dias com justificativa)
        IF(pt.data <= CURDATE(),
            (SELECT SEC_TO_TIME(
                SUM(
                    TIME_TO_SEC(ps.total_trabalhado) - TIME_TO_SEC(ps.total_esperado)
                )
            ) FROM vw_pontos_trabalho ps
            JOIN vw_pontos_status vs ON ps.ponto_id = vs.ponto_id
            WHERE ps.usuario_id = pt.usuario_id 
            AND ps.data <= pt.data 
            AND vs.folga = 0 
            AND vs.feriado = 0
            AND vs.justificativa = 0),
            NULL
        ) AS saldo_acumulado

    FROM vw_pontos_trabalho pt
    JOIN vw_pontos_status ps ON pt.ponto_id = ps.ponto_id;
  `);

  Util.Log.info(`# Criado view vw_pontos_saldos`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS vw_pontos_saldos;`);
}
