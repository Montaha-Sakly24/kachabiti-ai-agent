// Le backend renvoie parfois des dates UTC sans fuseau ("2026-09-28T10:00:00").
// On force l'interprétation en UTC pour éviter un décalage horaire.
export function parseDate(iso: string): Date {
  const hasTimezone = /(Z|[+-]\d{2}:?\d{2})$/.test(iso);
  return new Date(hasTimezone ? iso : `${iso}Z`);
}

export function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - parseDate(iso).getTime()) / 1000));
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}
