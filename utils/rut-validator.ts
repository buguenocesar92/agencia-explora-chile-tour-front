/**
 * Validador de RUT chileno
 */

/**
 * Elimina puntos, guiones y espacios del RUT
 * @param {string} rut - RUT a formatear
 * @returns {string} - RUT formateado
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '');
}

/**
 * Formatea un RUT al formato estándar (XX.XXX.XXX-X)
 * @param {string} rut - RUT a formatear
 * @returns {string} - RUT formateado
 */
export function formatRut(rut: string): string {
  const clean = cleanRut(rut);
  if (clean.length < 2) return clean;
  
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  
  let formatted = '';
  let counter = 0;
  
  // Recorre el cuerpo del RUT al revés
  for (let i = body.length - 1; i >= 0; i--) {
    formatted = body[i] + formatted;
    counter++;
    
    // Agrega un punto cada tres dígitos
    if (counter === 3 && i !== 0) {
      formatted = '.' + formatted;
      counter = 0;
    }
  }
  
  return `${formatted}-${dv}`;
}

/**
 * Valida que un RUT sea válido (algoritmo módulo 11)
 * @param {string} rut - RUT a validar
 * @returns {boolean} - true si es válido, false si no lo es
 */
export function validateRut(rut: string): boolean {
  const clean = cleanRut(rut);
  
  // Si está vacío o es muy corto, no es válido
  if (!clean || clean.length < 8) {
    return false;
  }
  
  // Separar cuerpo y dígito verificador
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();
  
  // Calcular dígito verificador
  let sum = 0;
  let factor = 2;
  
  // Recorremos el cuerpo del RUT de derecha a izquierda
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  
  // Calcular dígito verificador esperado
  const expectedDV = 11 - (sum % 11);
  let expectedDVStr = '';
  
  if (expectedDV === 11) {
    expectedDVStr = '0';
  } else if (expectedDV === 10) {
    expectedDVStr = 'K';
  } else {
    expectedDVStr = expectedDV.toString();
  }
  
  // Comparar dígito verificador calculado con el proporcionado
  return dv === expectedDVStr;
} 