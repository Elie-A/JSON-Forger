export interface PropertySchema {
  type: string;
  format?: string;
  pattern?: RegExp;
  enum?: any[];
  useDefault?: boolean;
  default?: any;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  length?: number;
  items?: PropertySchema[];
  countryCode?: string;
  required?: string[];
  properties?: { [key: string]: PropertySchema };
}
