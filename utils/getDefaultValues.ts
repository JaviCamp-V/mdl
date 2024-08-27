import { Field, RHFElementsType } from '@/types/common/IForm';
import Values from '@/types/common/Values';

interface FieldMap {
  [key: string]: any;
}

const mapToDefaultValues = ({ type, multiple, options, fields }: Field): any => {
  switch (type) {
    case 'date':
    case 'media_select':
      return null;
    case 'checkbox':
      return multiple ? options?.map(({ value }) => ({ value: value, checked: false })) : false;
    case 'number':
    case 'ratings':
      return 0;
    case 'multi_search':
      return [];

    case 'slider':
      return [0, 0];

    case 'group':
      return fields ? getDefaultValues(fields) : {};

    default:
      return '';
  }
};
const getDefaultValues = (fields: FieldMap): Values =>
  Object.values(fields).reduce(
    (defaultValues, field) => ({ ...defaultValues, [field?.name]: mapToDefaultValues(field) }),
    {}
  );

export default getDefaultValues;