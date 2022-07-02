export type FormFieldTypes = 'number' | 'string' | 'color' | 'enum';
export interface IFormFieldBaseType {
  value: FormFieldTypes;
  default: number | string;
}

export interface IFormFieldTypeNumber extends IFormFieldBaseType {
  value: 'number'
}
export interface IFormFieldTypeString extends IFormFieldBaseType {
  value: 'string';
  default: string;
}
export interface IFormFieldTypeColor extends IFormFieldBaseType {
  value: 'color'
}

export interface IFormFieldTypeEnumOption {
  id: string;
  name: string;
}
export interface IFormFieldTypeEnum extends IFormFieldBaseType {
  value: 'enum';
  default: string;
  options: IFormFieldTypeEnumOption[];
}

export type IFormFieldType = IFormFieldTypeNumber | IFormFieldTypeString | IFormFieldTypeEnum | IFormFieldTypeColor

export interface IFormField {
  id: string;
  name: string;
  type: IFormFieldType;
  description?: string;
  help?: string;
}
