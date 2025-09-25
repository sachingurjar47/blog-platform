declare module "@editorjs/editorjs" {
  export default class EditorJS {
    constructor(config: unknown);
    isReady: Promise<void>;
    destroy(): void;
    save(): Promise<unknown>;
  }
}

declare module "@editorjs/header" {
  export default class Header {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/list" {
  export default class List {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/paragraph" {
  export default class Paragraph {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/quote" {
  export default class Quote {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/code" {
  export default class Code {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/image" {
  export default class Image {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/inline-code" {
  export default class InlineCode {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/marker" {
  export default class Marker {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/delimiter" {
  export default class Delimiter {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}

declare module "@editorjs/underline" {
  export default class Underline {
    static get toolbox(): unknown;
    static get sanitize(): unknown;
  }
}
