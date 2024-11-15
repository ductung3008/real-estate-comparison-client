export interface ApiResponse<T> {
  readonly meta: {
    readonly status: 'SUCCESS';
    readonly message: string;
  };
  readonly data: T;
}

export interface ErrorResponse {
  readonly meta: {
    readonly status: 'ERROR';
    readonly message: string;
  };
  readonly data: null;
}
