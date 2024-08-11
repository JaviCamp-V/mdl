interface FieldMap {
  [key: string]: any;
}

const getDefaultValues = (fields: FieldMap) =>
  Object.values(fields).reduce(
    (defaultValues, field) => ({ ...defaultValues, [field?.name]: field?.type === 'file' ? [] : '' }),
    {}
  );

export default getDefaultValues;
