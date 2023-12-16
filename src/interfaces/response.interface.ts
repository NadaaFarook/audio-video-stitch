export interface IResponse {
  status: number;
  body: {
    message?: string;
    data?: object | string;
    error?: object | string;
  };
}
