import { RHFElementsType } from '@/types/common/IForm';

interface FieldMap {
  [key: string]: any;
}

const mapToDefaultValues = (type: RHFElementsType) => {
  switch (type) {
    case 'date':
      return null;
    case 'checkbox':
      return false;
    case 'number':
    case 'ratings':
      return 0;

    default:
      return '';
  }
};
const getDefaultValues = (fields: FieldMap) =>
  Object.values(fields).reduce(
    (defaultValues, field) => ({ ...defaultValues, [field?.name]: mapToDefaultValues(field?.type) }),
    {}
  );

export default getDefaultValues;
