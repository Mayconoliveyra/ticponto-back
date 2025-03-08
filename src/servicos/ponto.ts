import moment from 'moment';

import { Repositorios } from '../repositorios';

import { Util } from '../util';

const gerarRegistrosPonto = async (usuarioId: number) => {
  const hoje = moment().format('YYYY-MM-DD');
  const diasParaGerar = 90; // Gerar apenas os próximos 3 meses

  for (let i = 0; i < diasParaGerar; i++) {
    const dataAtual = moment(hoje).add(i, 'days').format('YYYY-MM-DD');

    // Buscar horários esperados do funcionário para o dia
    const horariosEsperados = await Repositorios.Ponto.obterHorariosEsperados(usuarioId, dataAtual);

    if (!horariosEsperados) {
      Util.Log.error(`Nenhum horário esperado encontrado para ${usuarioId} em ${dataAtual}`);

      continue;
    }

    // Definir os horários esperados de forma segura
    const esperado_inicio_1 = horariosEsperados.esperado_inicio_1;
    const esperado_saida_1 = horariosEsperados.esperado_saida_1;
    const esperado_inicio_2 = horariosEsperados.esperado_inicio_2;
    const esperado_saida_2 = horariosEsperados.esperado_saida_2;

    // Verificar se já existe um registro de ponto para o dia
    const existeRegistro = await Repositorios.Ponto.buscarRegistroPorData(usuarioId, dataAtual);

    if (!existeRegistro) {
      await Repositorios.Ponto.registrar({
        usuario_id: usuarioId,
        data: dataAtual,
        entrada_1: null,
        saida_1: null,
        entrada_2: null,
        saida_2: null,
        extra_entrada: null,
        extra_saida: null,
        esperado_inicio_1,
        esperado_saida_1,
        esperado_inicio_2,
        esperado_saida_2,
      });
    }
  }
};

export const Ponto = { gerarRegistrosPonto };
