import moment from 'moment';

// Configurações globais do moment
moment.locale('pt-br'); // Definir o idioma padrão (pode ser ajustado depois)

const formatarDataHora = (data?: string | Date, formato = 'YYYY-MM-DD HH:mm:ss'): string => {
  return moment(data).format(formato);
};

const obterDataAtual = (formato = 'YYYY-MM-DD HH:mm:ss'): string => {
  return moment().format(formato);
};

const obterTimestampAtual = (): number => {
  return moment().unix();
};

const isAntes = (data1: string | Date, data2: string | Date): boolean => {
  return moment(data1).isBefore(moment(data2));
};

const isDepois = (data1: string | Date, data2: string | Date): boolean => {
  return moment(data1).isAfter(moment(data2));
};

const isMesmoDia = (data1: string | Date, data2: string | Date): boolean => {
  return moment(data1).isSame(moment(data2), 'day');
};

export const DataHora = {
  formatarDataHora,
  obterDataAtual,
  obterTimestampAtual,
  isAntes,
  isDepois,
  isMesmoDia,
};
