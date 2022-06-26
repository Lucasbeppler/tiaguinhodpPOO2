// Cálculo do pis:
// 0.65% do valor da nota fiscal
export function calculatePis(nf: number) {
  return 0.0065 * nf;
}
// Cálculo do cofins:
// 3% do valor da nota fiscal
export function calculateCofins(nf: number) {
  return 0.03 * nf;
}
// Cálculo do Csll:
// 1% do valor da nota fiscal
export function calculateCsll(nf: number) {
  return 0.01 * nf;
}
// Cálculo do iss:
// 4% do valor da nota fiscal
export function calculateIss(nf: number) {
  return 0.04 * nf;
}
// Cálculo do valor liquido da nota fiscal
// Valor da nf - pis - cofins - iss
export function calculateLiqNf(nf: number, pis: number, cofins: number, iss: number) {
  return nf - pis - cofins - iss;
}

interface Invoice {
  id: string;
  client: string;
  invoice: string;
  invoice_value: number;
  pis?: number;
  cofins?: number;
  csll?: number;
  iss?: number;
  liqNf?: number;
}

export function calculateTotalNf(array: Invoice[]) {
  return array.reduce((previousValue, item) => (item?.invoice_value || 0) + previousValue ,0)
}
export function calculateTotalPis(array: Invoice[]) {
  return array.reduce((previousValue, item) => (item?.pis || 0) + previousValue ,0)
}
export function calculateTotalCofins(array: Invoice[]) {
  return array.reduce((previousValue, item) => (item?.cofins || 0) + previousValue ,0)
}
export function calculateTotalCsll(array: Invoice[]) {
  return array.reduce((previousValue, item) => (item?.csll || 0) + previousValue ,0)
}
export function calculateTotalIss(array: Invoice[]) {
  return array.reduce((previousValue, item) => (item?.iss || 0) + previousValue ,0)
}
export function calculateTotalLiqNf(array: Invoice[]) {
  return array.reduce((previousValue, item) => (item?.liqNf || 0) + previousValue ,0)
}

