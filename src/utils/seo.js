const DEFAULT_DESCRIPTION =
  "Encuentra la película adecuada en el momento adecuado. Cine para crecer, reflexionar y reconectar contigo.";

function updateMeta(selector, attribute, value) {
  const element = document.querySelector(selector);

  if (!element || !value) {
    return;
  }

  element.setAttribute(attribute, value);
}

export function applySeo({
  title,
  description = DEFAULT_DESCRIPTION,
  ogTitle = title,
  ogDescription = description,
} = {}) {
  if (title) {
    document.title = title;
  }

  updateMeta('meta[name="description"]', "content", description);
  updateMeta('meta[property="og:title"]', "content", ogTitle);
  updateMeta('meta[property="og:description"]', "content", ogDescription);
}

export { DEFAULT_DESCRIPTION };
