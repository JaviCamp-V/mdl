const removeProperty = (propKey: string, { [propKey]: propValue, ...rest }) => rest;
export default removeProperty;
