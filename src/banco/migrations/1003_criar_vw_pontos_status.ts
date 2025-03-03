import { Knex } from 'knex';

import { Util } from '../../util';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE VIEW vw_pontos_status AS
    SELECT 
        pb.ponto_id,
        pb.usuario_id,
        pb.data,

        -- Feriado: se a data está na tabela de feriados e não houve registro de ponto
        IF(
            EXISTS(SELECT 1 FROM feriados f WHERE f.data = pb.data) 
            AND pb.entrada_1 IS NULL AND pb.entrada_2 IS NULL 
            AND pb.saida_1 IS NULL AND pb.saida_2 IS NULL, 
            1, 0
        ) AS feriado,

        -- Justificativa: se há justificativa para o dia
        IF(
            EXISTS(SELECT 1 FROM justificativas j WHERE j.usuario_id = pb.usuario_id AND j.data = pb.data), 
            1, 0
        ) AS justificativa,

        -- Folga: se não há horários esperados
        IF(pb.esperado_inicio_1 IS NULL AND pb.esperado_saida_1 IS NULL, 1, 0) AS folga,

        -- Falta: apenas se não for feriado nem folga e não houver justificativa
        IF(
            pb.data <= CURDATE() 
            AND pb.entrada_1 IS NULL AND pb.entrada_2 IS NULL 
            AND pb.esperado_inicio_1 IS NOT NULL 
            AND pb.esperado_saida_1 IS NOT NULL 
            AND NOT EXISTS (SELECT 1 FROM justificativas j WHERE j.usuario_id = pb.usuario_id AND j.data = pb.data)
            AND NOT EXISTS (SELECT 1 FROM feriados f WHERE f.data = pb.data),
            1, 0
        ) AS falta,

        -- Divergência: Calcula apenas se NÃO for feriado, justificativa, folga ou falta
        IF(
            pb.data <= CURDATE()
            AND NOT EXISTS (SELECT 1 FROM feriados f WHERE f.data = pb.data)
            AND NOT EXISTS (SELECT 1 FROM justificativas j WHERE j.usuario_id = pb.usuario_id AND j.data = pb.data)
            AND pb.esperado_inicio_1 IS NOT NULL -- Se há horário esperado, significa que não é folga
            AND pb.esperado_saida_1 IS NOT NULL
            AND pb.entrada_1 IS NOT NULL -- Se há registro, não é falta
            AND ABS(
                COALESCE(
                    TIME_TO_SEC(TIMEDIFF(pt.total_trabalhado, pt.total_esperado)), 
                    0
                )
            ) > 600, 
            1, 0
        ) AS divergencia

    FROM vw_pontos_base pb
    JOIN vw_pontos_trabalho pt ON pb.ponto_id = pt.ponto_id;
  `);

  Util.log.info(`# Criado view vw_pontos_status`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS vw_pontos_status;`);
}
