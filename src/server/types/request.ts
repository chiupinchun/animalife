export interface RequestCtx {
  query: Record<string, string | string[]>
  params: Record<string, string>
  body: Record<string, any>
}
