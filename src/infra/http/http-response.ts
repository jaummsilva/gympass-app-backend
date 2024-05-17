export interface HttpResponse {
  json(data: object | undefined): this
  send(): this
  status(code: number): this
  setCookie(name: string, value: string, options?: object): this
}
