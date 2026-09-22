declare module "js-cookie" {
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    sameSite?: "strict" | "lax" | "none";
  }

  interface CookiesStatic {
    get(name: string): string | undefined;
    set(name: string, value: string, attributes?: CookieAttributes): string;
  }

  const Cookies: CookiesStatic;

  export default Cookies;
}