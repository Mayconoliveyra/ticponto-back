import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE VIEW vw_pontos_final AS
    SELECT 
        pb.ponto_id, pb.usuario_id, pb.usuario_nome, pb.data,
        pb.entrada_1, pb.saida_1, pb.entrada_2, pb.saida_2, pb.extra_entrada, pb.extra_saida,
        pb.esperado_inicio_1, pb.esperado_saida_1, pb.esperado_inicio_2, pb.esperado_saida_2,
        
        pt.periodo_1, pt.periodo_2, pt.periodo_extra, pt.total_trabalhado, pt.total_esperado,
        psaldo.saldo_dia, psaldo.saldo_acumulado,

        pstatus.falta, pstatus.folga, pstatus.feriado, pstatus.justificativa

    FROM vw_pontos_base pb
    JOIN vw_pontos_trabalho pt ON pb.ponto_id = pt.ponto_id
    JOIN vw_pontos_saldos psaldo ON pb.ponto_id = psaldo.ponto_id
    JOIN vw_pontos_status pstatus ON pb.ponto_id = pstatus.ponto_id;
  `);

  Util.log.info(`# Criado view ${ETableNames.vw_pontos_final}`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS ${ETableNames.vw_pontos_final};`);
}
