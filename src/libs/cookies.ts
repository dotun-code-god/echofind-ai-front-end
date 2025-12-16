import Cookie from "js-cookie";

type CookieKeys = "efai";

export const getCookie = (key: CookieKeys) => {
    return Cookie.get(key);
}

export const saveCookie = (key: CookieKeys, value: string) => {
    return Cookie.set(key, value);
}

export const removeCookie = (key: CookieKeys) => {
    return Cookie.remove(key);
}