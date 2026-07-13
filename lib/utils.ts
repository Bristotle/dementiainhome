export function cn(...classes: (string|undefined|null|false)[]): string {
  return classes.filter(Boolean).join(" ");
}
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").trim();
}
