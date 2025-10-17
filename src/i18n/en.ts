const en = {
  nav: {
    home: 'Home',
    about: 'About Us',
    reservations: 'Reservations',
    searchAccommodation: 'Search accommodation',
    login: 'Log in',
    changeMode: 'Change mode'
  },
  login: {
    loginTitle: 'Log in',
    signupTitle: 'Create account',
    email: 'Email',
    password: 'Password',
    processing: 'Processing...',
    enter: 'Enter',
    signup: 'Sign up',
    noAccount: 'Don\'t have an account?',
    haveAccount: 'Already have an account?',
    register: 'Register',
    login: 'Log in'
  },
  seeker: {
    invalidDate: 'Please select a valid date',
    guests: 'Guests',
    search: 'Search',
    expandSearch: 'Expand your search',
    knowZones: 'Know Our Zones',
    noRooms: 'No rooms available for the selected date range.'
  },
  home: {
    discoverStay: 'Discover the ideal lodging for your stay',
    description:
      'Comfortable, natural and flexible spaces. Book easily by days and guests.',
    searchPlace: 'Find your place'
  },
  sections: {
    discoverSpaces: 'Discover unique spaces for your stay',
    uniquePlaces:
      'Unique places available in different areas for your next stay'
  },
  availability: {
    reservedOrUnavailable: 'Already reserved / No availability',
    reserveNow: 'Reserve now',
    noAvailability: 'No availability',
    serviceAdded: 'Service added to the room type',
    serviceAddError: 'Could not add the service. Please try again.'
  },
  reserve: {
    steps: {
      selection: 'Your selection',
      details: 'Your details',
      confirmation: 'Finish reservation'
    },
    buttons: {
      back: 'Back',
      continue: 'Continue',
      goBackAdd: 'Go back / Add another reservation',
      pay: 'Pay reservation',
      backSimple: 'Go back',
      login: 'Log in',
      apply: 'Apply'
    },
    summary: {
      title: 'Your reservation summary',
      empty: 'No reservation data',
      propertyFallback: 'Property',
      searchAnotherRoom: 'Search another room in this property',
      propertyTotalPrefix: 'Property total',
      grandTotal: 'Grand total',
      roomImageAlt: 'Room image',
      thumbnailAlt: 'Thumbnail',
      servicesTitle: 'Included services',
      nights: {
        singular: 'night',
        plural: 'nights'
      },
      rooms: {
        singular: 'room',
        plural: 'rooms'
      }
    },
    guests: {
      singular: 'guest',
      plural: 'guests'
    },
    terms: {
      propertyTitle: 'Property terms and conditions',
      confirmation: 'Confirmation condition',
      checkIn: 'Check-in time',
      checkOut: 'Check-out time',
      cancellation: 'Cancellation policy',
      additional: 'Additional information',
      title: 'Terms and conditions'
    },
    form: {
      title: 'Guest details',
      nameLabel: 'Full name',
      namePlaceholder: 'E.g. John Doe',
      emailLabel: 'Email',
      emailPlaceholder: 'E.g. john@email.com',
      phoneLabel: 'Phone',
      phonePlaceholder: 'E.g. +1 555 123 4567',
      addressLabel: 'Address',
      addressPlaceholder: 'E.g. 123 Main St',
      cityLabel: 'City',
      countryLabel: 'Country',
      cpLabel: 'Postal code',
      remarksLabel: 'Additional comments',
      remarksPlaceholder: 'E.g. I will arrive after 8pm',
      corporateLabel: 'Company / Corporate client',
      regionLabel: 'Region',
      countryIsoLabel: 'Country code (ISO)',
      processing: 'Processing...',
      continue: 'Continue'
    },
    validation: {
      name: 'Must be at least 3 letters',
      email: 'Invalid email',
      phone: 'Invalid phone number',
      cp: 'Numbers only, max 10 digits',
      remarks: 'Maximum 200 characters'
    },
    toasts: {
      reservationConfirmed: 'Reservation confirmed',
      noPaymentInfo: 'No payment information received',
      confirmError: 'Error confirming reservations',
      couponApplied: 'Coupon applied',
      voucherApplied: 'Voucher applied',
      codeNotApplicable: 'Code not applicable',
      codeInvalid: 'Invalid code'
    },
    loginPrompt: {
      message:
        'Do you have an account? Log in to use your details and apply discount codes.',
      login: 'Log in'
    },
    voucher: {
      label: 'Enter your voucher code:',
      placeholder: 'E.g. DISCOUNT10',
      usingCoupon: 'Using coupon',
      usingVoucher: 'Using voucher'
    },
    ticket: {
      title: 'Reservation Ticket',
      guestDataTitle: 'Guest details',
      empty: 'No reservations to show.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal code',
      country: 'Country',
      comments: 'Comments',
      reservationsTitle: 'Reservations made',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      total: 'Total',
      grandTotal: 'Grand total paid'
    }
  },
  profile: {
    notLoggedTitle: 'Session not started',
    notLoggedDescription: 'Please log in to view your profile.',
    goToLogin: 'Go to login',
    title: 'My profile',
    emailLabel: 'Email',
    totalSpentLabel: 'Total spent in Dozzze',
    reservationsTitle: 'My reservations',
    loading: 'Loading reservations...',
    empty: 'You do not have reservations yet.',
    totalLabel: 'Total:',
    cancelButton: 'Cancel reservation',
    cancelling: 'Cancelling...',
    canceledStatus: 'Reservation cancelled',
    finishedStatus: 'Reservation completed',
    activeStatus: 'Active reservation',
    confirmModalMessage: 'Are you sure you want to cancel this reservation?',
    confirmModalConfirm: 'Confirm',
    confirmModalCancel: 'Go back',
    cancelError: 'Error cancelling reservation',
    noReservationId: 'Reservation ID not found'
  },
  zone: {
    errorNotFound: 'Zone not found',
    headerLabel: 'Zone:',
    seeMore: 'See more',
    seeLess: 'See less',
    noProperties: 'No properties available.',
    gallery: {
      mainAltPrefix: 'Main image of',
      thumbnailAltPrefix: 'Thumbnail'
    },
    hero: {
      badge: 'Spotlight zone',
      descriptionFallback: 'Explore this area and find the stay that fits you.'
    },
    stats: {
      properties: 'Active properties',
      rooms: 'Room types',
      services: 'Highlight services'
    },
    selector: {
      title: 'Explore other zones',
      subtitle: 'Switch to compare similar stays'
    },
    actions: {
      exploreMap: 'View map',
      viewGallery: 'View gallery'
    },
    servicesLabel: 'Popular services'
  },
  propertyCard: {
    info: {
      addressFallback: 'Address not available',
      descriptionFallback: 'Description not available',
      ratingSuffix: '.0'
    },
    actions: {
      noContact: 'Not available',
      roomsLabel: 'Available rooms:',
      viewRooms: 'View rooms'
    },
    media: {
      mainAlt: 'Main image',
      thumbnailAltPrefix: 'Thumbnail'
    },
    roomsCarousel: {
      title: 'Featured rooms',
      subtitle: 'Get inspired and choose the perfect stay',
      countSuffix: 'rooms available',
      servicesLabel: 'Key services',
      servicesFallbackText: 'No highlighted services',
      descriptionFallback: 'Description not available',
      detailsCta: 'See details',
      prev: 'Previous room',
      next: 'Next room',
      propertyTag: 'Rooms at'
    }
  },
  about: {
    title: 'About Us',
    company: 'Company',
    billing: 'Billing conditions',
    contact: 'Contact',
    companyName: 'Explotaciones Hosteleras Infantas S.L',
    slogan: 'Accommodation, reservations and professional management solutions',
    billingData: 'Billing Data',
    taxId: 'CIF',
    address: 'Address',
    billingConditionsTitle: 'Billing Conditions',
    billingConditions: [
      'Invoices will only be issued in the name of Explotaciones Hosteleras Infantas S.L, with CIF B88590989.',
      'Please ensure you provide all necessary information for correct invoice issuance during the purchase or service contracting process.',
      'If you detect any error in the invoice data, you have 7 business days from receipt to request its correction.',
      'In case of returns or cancellations, refunds will be made using the same original payment method within 14 business days.'
    ],
    invoiceDeliveryTitle: 'Invoice Delivery',
    billingInfo: 'Electronic invoices will be sent to the email provided at the time of purchase.',
    physicalInvoiceRequest: 'If you need to receive a physical invoice, you can request it',
    consultContact: 'consulting contact',
    legalRequirementsTitle: 'Legal Requirements',
    legalRequirements:
      'All our invoices comply with the current tax regulations in Spain, according to the standards established by the Tax Agency.'
  }
};
export default en;
