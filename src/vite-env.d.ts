/// <reference types="vite/client" />

declare module "*.md" {
  // "unknown" would be more detailed depends on how you structure frontmatter
  const attributes: Record<string, unknown>;

  // When "Mode.HTML" is requested
  const html: string;

  // When "Mode.Vue" is requested
  import { ComponentOptions, Component } from "vue";
  const VueComponent: ComponentOptions;
  const VueComponentWith: (
    components: Record<string, Component>,
  ) => ComponentOptions;

  // Modify below per your usage
  export { attributes, html, VueComponent, VueComponentWith };
}
