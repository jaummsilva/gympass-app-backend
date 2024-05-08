export interface HttpResponse {
  json(data: object | undefined): this
  send(): this
  status(code: number): this
}
