import sanitize from 'sanitizer';

export const codeToJson = () => {
  /* ... */
};

export const codeToHtml = (code, convert) => {
  const sanitized = sanitize(code);
  const html = convert(sanitized);
  return html;
};
