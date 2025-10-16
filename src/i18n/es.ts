const es = {
  nav: {
    home: 'Inicio',
    about: 'Nosotros',
    reservations: 'Reservas',
    searchAccommodation: 'Buscar alojamiento',
    login: 'Iniciar sesión',
    changeMode: 'Cambiar modo'
  },
  login: {
    loginTitle: 'Iniciar sesión',
    signupTitle: 'Crear cuenta',
    email: 'Email',
    password: 'Contraseña',
    processing: 'Procesando...',
    enter: 'Entrar',
    signup: 'Registrarme',
    noAccount: '¿No tenés cuenta?',
    haveAccount: '¿Ya tenés una cuenta?',
    register: 'Registrate',
    login: 'Iniciar sesión'
  },
  seeker: {
    invalidDate: 'Por favor seleccioná una fecha válida',
    guests: 'Huésp.',
    search: 'Buscar',
    expandSearch: 'Expandí tu búsqueda',
    knowZones: 'Conocé Nuestras Zonas',
    noRooms: 'No hay habitaciones disponibles para el rango de fechas seleccionado.'
  },
  home: {
    discoverStay: 'Descubrí el hospedaje ideal para tu estadía',
    description:
      'Espacios cómodos, naturales y flexibles. Reservá por días y personas fácilmente.',
    searchPlace: 'Busca tu lugar'
  },
  sections: {
    discoverSpaces: 'Descubrí espacios únicos para tu estadía',
    uniquePlaces:
      'Lugares únicos disponibles en distintas zonas para tu próxima estadía'
  },
  availability: {
    reservedOrUnavailable: 'Ya reservada / Sin disponibilidad',
    reserveNow: 'Reservar ahora',
    noAvailability: 'Sin disponibilidad',
    serviceAdded: 'Servicio agregado a la habitación',
    serviceAddError: 'No pudimos agregar el servicio. Intentá nuevamente.'
  },
  reserve: {
    steps: {
      selection: 'Tu selección',
      details: 'Tus datos',
      confirmation: 'Terminar reserva'
    },
    buttons: {
      back: 'Atrás',
      continue: 'Continuar',
      goBackAdd: 'Volver / Agregar otra reservación',
      pay: 'Pagar reserva',
      backSimple: 'Volver',
      login: 'Iniciar sesión',
      apply: 'Aplicar'
    },
    summary: {
      title: 'Resumen de tu reserva',
      empty: 'No hay datos de reserva',
      propertyFallback: 'Propiedad',
      searchAnotherRoom: 'Buscar otra habitación en esta propiedad',
      propertyTotalPrefix: 'Total propiedad',
      grandTotal: 'Total general',
      roomImageAlt: 'Imagen habitación',
      thumbnailAlt: 'Miniatura',
      servicesTitle: 'Servicios incluidos',
      nights: {
        singular: 'noche',
        plural: 'noches'
      },
      rooms: {
        singular: 'habitación',
        plural: 'habitaciones'
      }
    },
    guests: {
      singular: 'huésped',
      plural: 'huéspedes'
    },
    terms: {
      propertyTitle: 'Términos y condiciones de la propiedad',
      confirmation: 'Condición de confirmación',
      checkIn: 'Horario de Check-in',
      checkOut: 'Horario de Check-out',
      cancellation: 'Política de cancelación',
      additional: 'Información adicional',
      title: 'Términos y condiciones'
    },
    form: {
      title: 'Datos del huésped',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Ej: Juan Pérez',
      emailLabel: 'Email',
      emailPlaceholder: 'Ej: juan@email.com',
      phoneLabel: 'Teléfono',
      phonePlaceholder: 'Ej: +54 9 11 1234-5678',
      addressLabel: 'Dirección',
      addressPlaceholder: 'Ej: Calle Falsa 123',
      cityLabel: 'Ciudad',
      countryLabel: 'País',
      cpLabel: 'Código postal',
      remarksLabel: 'Comentarios adicionales',
      remarksPlaceholder: 'Ej: Llegaré después de las 20 hs',
      corporateLabel: 'Empresa / Cliente corporativo',
      regionLabel: 'Región',
      countryIsoLabel: 'Código país (ISO)',
      processing: 'Procesando...',
      continue: 'Continuar'
    },
    validation: {
      name: 'Debe tener al menos 3 letras',
      email: 'Email inválido',
      phone: 'Teléfono inválido',
      cp: 'Solo números, máx 10 dígitos',
      remarks: 'Máximo 200 caracteres'
    },
    toasts: {
      reservationConfirmed: 'Reserva Confirmada',
      noPaymentInfo: 'No se recibió información de pago',
      confirmError: 'Error al confirmar reservas',
      couponApplied: 'Cupón aplicado',
      voucherApplied: 'Voucher aplicado',
      codeNotApplicable: 'Código no aplicable',
      codeInvalid: 'Código no válido'
    },
    loginPrompt: {
      message:
        '¿Tenés una cuenta? Iniciá sesión para usar tus datos y aplicar códigos de descuento.',
      login: 'Iniciar sesión'
    },
    voucher: {
      label: 'Ingresá tu código de voucher:',
      placeholder: 'Ej: DESCUENTO10',
      usingCoupon: 'Usando cupón',
      usingVoucher: 'Usando voucher'
    },
    ticket: {
      title: 'Ticket de Reserva',
      guestDataTitle: 'Datos del huésped',
      empty: 'No hay reservas para mostrar.',
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      address: 'Dirección',
      city: 'Ciudad',
      postalCode: 'Código Postal',
      country: 'País',
      comments: 'Comentarios',
      reservationsTitle: 'Reservas realizadas',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      total: 'Total',
      grandTotal: 'Total general pagado'
    }
  },
  profile: {
    notLoggedTitle: 'Sesión no iniciada',
    notLoggedDescription: 'Por favor iniciá sesión para ver tu perfil.',
    goToLogin: 'Ir al login',
    title: 'Mi perfil',
    emailLabel: 'Email',
    totalSpentLabel: 'Gasto total en Dozzze',
    reservationsTitle: 'Mis reservas',
    loading: 'Cargando reservas...',
    empty: 'Aún no tenés reservas.',
    totalLabel: 'Total:',
    cancelButton: 'Cancelar reserva',
    cancelling: 'Cancelando...',
    canceledStatus: 'Reserva cancelada',
    finishedStatus: 'Reserva finalizada',
    activeStatus: 'Reserva vigente',
    confirmModalMessage: '¿Estás seguro de cancelar esta reserva?',
    confirmModalConfirm: 'Confirmar',
    confirmModalCancel: 'Volver',
    cancelError: 'Error al cancelar la reserva',
    noReservationId: 'Id de reserva no encontrado'
  },
  zone: {
    errorNotFound: 'Zona no encontrada',
    headerLabel: 'Zona:',
    seeMore: 'Ver más',
    seeLess: 'Ver menos',
    noProperties: 'No hay propiedades disponibles.',
    gallery: {
      mainAltPrefix: 'Imagen principal de',
      thumbnailAltPrefix: 'Miniatura'
    }
  },
  propertyCard: {
    info: {
      addressFallback: 'Dirección no disponible',
      descriptionFallback: 'Descripción no disponible',
      ratingSuffix: '.0'
    },
    actions: {
      noContact: 'No disponible',
      roomsLabel: 'Habitaciones disponibles:',
      viewRooms: 'Ver habitaciones'
    },
    media: {
      mainAlt: 'Imagen principal',
      thumbnailAltPrefix: 'Miniatura'
    }
  },
  about: {
    title: 'Sobre Nosotros',
    company: 'Empresa',
    billing: 'Condiciones de facturación',
    contact: 'Contacto',
    companyName: 'Explotaciones Hosteleras Infantas S.L',
    slogan: 'Soluciones de alojamiento, reservas y gestión profesional',
    billingData: 'Datos de Facturación',
    taxId: 'CIF',
    address: 'Dirección',
    billingConditionsTitle: 'Condiciones de Facturación',
    billingConditions: [
      'Las facturas se emitirán únicamente a nombre de Explotaciones Hosteleras Infantas S.L, con CIF B88590989.',
      'Por favor, asegurate de proporcionar todos los datos necesarios para la correcta emisión de tu factura durante el proceso de compra o contratación de servicios.',
      'Si detectás algún error en los datos de la factura, tenés un plazo de 7 días hábiles desde la recepción de la misma para solicitar su rectificación.',
      'En caso de devoluciones o cancelaciones, los reembolsos se realizarán utilizando el mismo método de pago original dentro de un plazo de 14 días hábiles.'
    ],
    invoiceDeliveryTitle: 'Envío de Facturas',
    billingInfo:
      'Las facturas electrónicas serán enviadas al correo electrónico proporcionado al momento de la compra.',
    physicalInvoiceRequest: 'Si necesitás recibir una factura en formato físico, podés solicitarlo',
    consultContact: 'consultando contacto',
    legalRequirementsTitle: 'Requisitos Legales',
    legalRequirements:
      'Todas nuestras facturas cumplen con la normativa fiscal vigente en España, según los estándares establecidos por la Agencia Tributaria.'
  }
};
export default es;
