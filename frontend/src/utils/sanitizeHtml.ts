const BLOCKED_TAGS = new Set(['script', 'iframe', 'object', 'embed', 'link', 'meta']);
const URI_ATTRS = new Set(['href', 'src']);

export function sanitizeHtml(html: string) {
  if (typeof window === 'undefined' || !html) return '';

  const template = document.createElement('template');
  template.innerHTML = html;

  template.content.querySelectorAll('*').forEach((node) => {
    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();

    if (BLOCKED_TAGS.has(tagName)) {
      element.remove();
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (name.startsWith('on')) {
        element.removeAttribute(attribute.name);
      }

      if (URI_ATTRS.has(name) && (value.startsWith('javascript:') || value.startsWith('data:text/html'))) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return template.innerHTML;
}
