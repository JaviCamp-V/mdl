import { Field, RHFElementsType } from '@/types/common/IForm';

interface FieldMap {
  [key: string]: any;
}

const mapToDefaultValues = ({ type, multiple, options }: Field) => {
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

    default:
      return '';
  }
};
const getDefaultValues = (fields: FieldMap) =>
  Object.values(fields).reduce(
    (defaultValues, field) => ({ ...defaultValues, [field?.name]: mapToDefaultValues(field) }),
    {}
  );

export default getDefaultValues;
