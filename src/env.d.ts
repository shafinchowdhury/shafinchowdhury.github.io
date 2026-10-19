/// <reference path="../.astro/types.d.ts" />

declare namespace astroHTML.JSX {
  interface FormHTMLAttributes {
    /** W3C WebMCP declarative tool name */
    toolname?: string | null;
    /** W3C WebMCP declarative tool description */
    tooldescription?: string | null;
    /** W3C WebMCP declarative tool auto-submit hint */
    toolautosubmit?: string | boolean | null;
  }

  interface InputHTMLAttributes {
    /** W3C WebMCP declarative parameter title */
    toolparamtitle?: string | null;
    /** W3C WebMCP declarative parameter description */
    toolparamdescription?: string | null;
  }

  interface SelectHTMLAttributes {
    /** W3C WebMCP declarative parameter title */
    toolparamtitle?: string | null;
    /** W3C WebMCP declarative parameter description */
    toolparamdescription?: string | null;
  }

  interface TextareaHTMLAttributes {
    /** W3C WebMCP declarative parameter title */
    toolparamtitle?: string | null;
    /** W3C WebMCP declarative parameter description */
    toolparamdescription?: string | null;
  }
}
