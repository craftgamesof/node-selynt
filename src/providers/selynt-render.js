import { promises as fs } from 'node:fs';
import path from 'node:path';
import Mustache from 'mustache';

export default function render(app, {
  root, layout = null, viewExt = 'html', cache = true
} = {}) {
  const tplCache = new Map();

  const load = async (file) => {
    if (cache && tplCache.has(file)) return tplCache.get(file);
    const txt = await fs.readFile(file, 'utf8');
    if (cache) tplCache.set(file, txt);
    return txt;
  };

  app.use(async (req, res, next) => {
    res.render = async (view, data = {}) => {
      const viewPath = path.join(root, `${view}.${viewExt}`);
      const viewTpl = await load(viewPath);
      const html = Mustache.render(viewTpl, data);

      if (!layout) {
        res.type('html').send(html);
        return;
      }
      const layoutTpl = await load(path.join(root, `${layout}.${viewExt}`));
      const out = Mustache.render(layoutTpl, { ...data, body: html });
      res.type('html').send(out);
    };
    next();
  });
}