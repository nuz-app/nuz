/// <reference types="node" />

declare module '*.module.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.module.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.module.less' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.jpg" {
  const value: string;
  export = value;
}

declare module "*.jpeg" {
  const value: string;
  export = value;
}

declare module "*.gif" {
  const value: string;
  export = value;
}

declare module "*.txt" {
  const value: string;
  export = value;
}

declare module '*.svg' {
  interface ISvg {
    [key: string]: any
    ReactComponent: any
  }
  const svg: ISvg;
  export = svg;
}
