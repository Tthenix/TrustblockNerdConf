declare global {
  interface Window {
    snsWebSdk: {
      init: (token: string, callback?: () => void) => {
        withConf: (config: {
          lang?: string;
          email?: string;
          country?: string;
          [key: string]: any;
        }) => any;
        withOptions: (options: {
          addViewportTag?: boolean;
          adaptIframeHeight?: boolean;
          [key: string]: any;
        }) => any;
        on: (event: string, callback: (payload: any) => void) => any;
        build: () => {
          launch: (selector: string) => void;
          destroy: () => void;
        };
      };
    };
  }
}

export {};
