declare module 'unique-selector' {
  export default function (
    element: Element,
    options?: {
      excludeRegex?: RegExp;
    }
  );
}
