const errorMessages: Record<number, string> = {
  // Reservation errors
  100: 'Error desconocido',
  101: 'No hay disponibilidad',
  102: 'Fechas inválidas',
  103: 'Pago fallido',
  104: 'Reserva no encontrada',

  // Property errors
  200: 'Fecha de check-in inválida',
  201: 'El check-in es posterior al check-out',
  202: 'Propiedad no encontrada',
  203: 'Error al procesar tarifas',
  204: 'Precio no encontrado',
  205: 'Sin disponibilidad',
  206: 'Habitación no encontrada',
  207: 'Zona o propiedad requerida',

  // Customer errors
  300: 'El correo ya existe',
  301: 'Usuario inactivo',
  302: 'Credenciales inválidas',
  303: 'Usuario no encontrado',
  304: 'No autenticado',
  305: 'Refresh token inválido',
  306: 'Token inválido',

  // Security errors
  400: 'Acceso denegado',

  // Zone errors
  500: 'Zona no encontrada',
  501: 'ID de zona inválido',
  502: 'Área de zona demasiado grande',
};

export default errorMessages;
