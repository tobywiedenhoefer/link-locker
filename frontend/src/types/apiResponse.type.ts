type ApiResponse<T> =
  | {
      success: true;
      payload: T;
    }
  | {
      success: false;
      errorCode: number;
      errorMessage: string;
    };

export type AsyncApiResponse<T> = Promise<ApiResponse<T>>;

export default ApiResponse;
