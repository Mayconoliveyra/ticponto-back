import moment from 'moment';

import { Repositorios } from '../repositorios';
import { IHorariosEsperados } from '../repositorios/ponto';

const gerarRegistrosPonto = async (usuarioId: number) => {
  const hoje = moment().format('YYYY-MM-DD');
  const diasParaGerar = 90; // Gerar apenas os próximos 3 meses

  for (let i = 0; i < diasParaGerar; i++) {
    const dataAtual = moment(hoje).add(i, 'days').format('YYYY-MM-DD');
    const diaSemana = moment(dataAtual).locale('pt-br').format('dddd').toLowerCase(); // Exemplo: segunda, terça

    // Buscar horários esperados do funcionário para o dia
    const horariosEsperados = await Repositorios.Ponto.obterHorariosEsperados(usuarioId, dataAtual);

    // Definir os horários esperados de forma segura
    const esperado_inicio_1 = horariosEsperados[`${diaSemana}_inicio_1` as keyof IHorariosEsperados] || null;
    const esperado_saida_1 = horariosEsperados[`${diaSemana}_saida_1` as keyof IHorariosEsperados] || null;
    const esperado_inicio_2 = horariosEsperados[`${diaSemana}_inicio_2` as keyof IHorariosEsperados] || null;
    const esperado_saida_2 = horariosEsperados[`${diaSemana}_saida_2` as keyof IHorariosEsperados] || null;

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
