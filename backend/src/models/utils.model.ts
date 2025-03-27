export type PublicSelect<T> = {
    [K in keyof T]: boolean;
  };