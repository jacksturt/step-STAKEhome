// type interface for async calls
interface IAsyncResultBase {
  isLoading?: boolean;
  loadingPrompt?: string;
  error?: Error;
}

export interface IAsyncResult<T> extends IAsyncResultBase {
  result: T;
}
