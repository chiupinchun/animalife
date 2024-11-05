import router from "@server/router"

/**
 * Maybe it would change to real api someday
 * @param url localStorage key mock db table
 * @param requestOption will be passed to localStorage.setItem
 * @returns generics
 */
export const request = <T = unknown>(
  url: string,
  requestOption: Omit<RequestInit, 'body'> & {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: Record<string, any>
  } = {}
) => {
  const { method = 'GET', ...option } = requestOption
  return router.response(url, method, option) as Promise<T>
}
