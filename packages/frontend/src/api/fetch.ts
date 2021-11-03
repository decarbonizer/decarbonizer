const apiBaseUrl = process.env.API_BASE_URL;

/**
 * A specialized {@link RequestInit} object to be used in conjunction with {@link decarbonizerFetch}.
 */
export interface DecarbonizerFetchInit extends Omit<Omit<RequestInit, 'body'>, 'headers'> {
  /**
   * The body to be sent with the request.
   * This is recommended to be a native object. If so, `decarbonizerFetch` will convert the object to JSON.
   */
  body?: BodyInit | object | null;
  headers?: Record<string, string>;
}

/**
 * The result of a {@link decarbonizerFetch} call.
 * A default {@link Response} which additionally contains the
 * deserialized JSON body returned by the associated REST API endpoint.
 */
export interface DecarbonizerFetchResponse<T = unknown> extends Response {
  /**
   * Deserialized JSON data from the response.
   */
  readonly data: T;
}

/**
 * Thrown by `decarbonizerFetch` if a request resulted in a non-sucessful status code.
 */
export class DecarbonizerFetchError extends Error {
  constructor(
    public response: DecarbonizerFetchResponse,
    message = `Decarbonizer API request failed with status ${response.status} ${response.statusText} for "${response.url}".`,
  ) {
    super(message);
  }
}

/**
 * A specialized `fetch` function for interacting specifically with the Decarbonizer API.
 * In comparison to the default `fetch`, this function does the following:
 *
 * * Works with relative URLs (such as `/api/v1/example`) by automatically appending the API's base URL.
 * * Rejects for non-sucessful status codes.
 * * Supports native objects as the body (will be converted to JSON).
 * * Parses JSON responses.
 * * If a user is signed in, automatically uses the user's token for API requests.
 * @param url The relative URL of the API endpoint to be invoked. Example: `/api/v1/example`.
 * @param init Optional initialization data for the request to be made.
 * @returns The response to the request.
 * @throws
 *  {@link DecarbonizerFetchError} if the request failed with a non-successful status code.
 *  {@link Error} if the request failed for other reasons (e.g. missing network connection).
 */
export async function decarbonizerFetch<T = unknown>(
  url: string,
  init: DecarbonizerFetchInit = {},
): Promise<DecarbonizerFetchResponse<T>> {
  if (!apiBaseUrl) {
    throw new Error('The API base URL is not defined. This is most likely due to an issue in the build configuration.');
  }

  init.headers = init.headers ?? {};

  if (typeof init.body === 'object') {
    init.body = JSON.stringify(init.body);

    if (init.headers['Content-Type'] === undefined) {
      init.headers['Content-Type'] = 'application/json';
    }
  }

  const fullUrl = getFullApiUrl(url).href;
  const response = (await fetch(fullUrl, init as RequestInit)) as Response & { data: T };
  response.data = await response.json().catch(() => undefined);

  if (response.ok) {
    return response;
  } else {
    throw new DecarbonizerFetchError(response);
  }
}

function getFullApiUrl(apiUrlSegment: string) {
  return new URL(apiUrlSegment, apiBaseUrl);
}
