export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'checkbox' | 'textarea' | 'file' | 'radio';
  group?: string;
  mandatory?: boolean;
  options?: { key: string; label: string }[];
  icon?: string;
};

export const SHOP_PROFILE = [
  { key: 'basic-info', label: 'Basic Info', icon: '/file.svg' },
  { key: 'branding', label: 'Branding', icon: '/globe.svg' },
];

export const BUSINESS_LOGISTICS = [
  { key: 'customer-booking-policies', label: 'Customer Booking Policies', icon: '/window.svg' },
  { key: 'scheduling', label: 'Scheduling', icon: '/window.svg' },
  { key: 'service-location', label: 'Service Location', icon: '/globe.svg' },
];

export const PERSONALIZATION = [
  { key: 'faq', label: 'Frequently Asked Questions', icon: '/file.svg' },
  { key: 'additional-questions', label: 'Additional Questions', icon: '/file.svg' },
  { key: 'customer-booking-form', label: 'Customer Booking Form', icon: '/file.svg' },
];

export const LIST_SERVICES = [
  { key: 'list-services', label: 'List Services', icon: '/file.svg' },
];

export const SECTION_FIELDS: Record<string, FieldDef[]> = {
  'basic-info': [
    { key: 'serviceCategory', label: 'Service Category', type: 'text', mandatory: true },
    { key: 'serviceSubcategory', label: 'Service Subcategory', type: 'text', mandatory: true },
    { key: 'homeAddress', label: 'Home Address', type: 'text', mandatory: true },
    { 
      key: 'entityType', 
      label: 'Entity Type', 
      type: 'radio', 
      mandatory: true,
      options: [
        { key: 'individual', label: 'Individual' },
        { key: 'company', label: 'Company' },
      ]
    },
  ],
  'branding': [
    { key: 'shopName', label: 'Shop Name', type: 'text', mandatory: true },
    { key: 'shopDescription', label: 'Description', type: 'textarea' },
    { key: 'shopPhoto', label: 'Photo', type: 'file' },
    { key: 'shopLogo', label: 'Logo', type: 'file' },
    { key: 'shopWebsite', label: 'Website', type: 'text' },
  ],
  'booking-policy': [
    { key: 'booking-policy-details', label: 'Booking Policy Details', type: 'textarea', mandatory: true },
  ],
  'payment-policy': [
    { key: 'payment-policy-details', label: 'Payment Policy Details', type: 'textarea', mandatory: true },
  ],
  'cancellation-policy': [
    { key: 'cancellation-policy-details', label: 'Cancellation Policy Details', type: 'textarea', mandatory: true },
  ],
  'late-policy': [
    { key: 'late-policy-details', label: 'Late Policy Details', type: 'textarea', mandatory: true },
  ],
  'personalization': [],
  'list-services': [],
}; 