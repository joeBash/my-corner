import fs from 'fs';
import path from 'path';

export const RED = '\x1b[31m';
export const GREEN = '\x1b[32m';
export const YELLOW = '\x1b[33m';
export const BLUE = '\x1b[34m';
export const MAGENTA = '\x1b[35m';
export const CYAN = '\x1b[36m';
export const WHITE = '\x1b[37m';
export const ORANGE = '\x1b[38;5;208m';
export const GRAY = '\x1b[90m';

export const RED_BG = '\x1b[41m';
export const GREEN_BG = '\x1b[42m';
export const YELLOW_BG = '\x1b[43m';
export const BLUE_BG = '\x1b[44m';
export const MAGENTA_BG = '\x1b[45m';
export const CYAN_BG = '\x1b[46m';
export const WHITE_BG = '\x1b[47m';
export const ORANGE_BG = '\x1b[48;5;208m';
export const GRAY_BG = '\x1b[100m';

export const RESET = '\x1b[0m';

export function checkSlashPageExists(link: string): boolean {
  const filePath = path.join(process.cwd(), 'src', 'pages', `${link.replace('/', '')}.astro`);

  return fs.existsSync(filePath);
}
