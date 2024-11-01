export class HttpResponse<T> {
   constructor(
      public statusCode: number,
      public message: string,
      public data?: T,
      public error?: string,
   ) {}
}
