export default interface GenericResponse<T = any> {
  message: string;
  data: T;
}
