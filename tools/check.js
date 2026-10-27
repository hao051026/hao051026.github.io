const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
process.chdir(ROOT);
const pages=['index.html','lessons.html','gallery.html','about.html','contact.html','404.html'];
const missing=[], issues=[];
for(const p of pages){
  const html=fs.readFileSync(p,'utf8');
  const refs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
  for(const r of refs){
    if(/^(https?:|mailto:|#|data:)/.test(r)) continue;
    const f=r.split('#')[0].split('?')[0];
    if(!fs.existsSync(path.join(ROOT,f))) missing.push(p+' -> '+r);
  }
  if(!/<meta name="viewport"/.test(html)) issues.push(p+': viewport');
  if(!/<title>/.test(html)) issues.push(p+': title');
  if(p!=='404.html' && !/<h1/.test(html)) issues.push(p+': h1');
  const o=(html.match(/<div/g)||[]).length, c=(html.match(/<\/div>/g)||[]).length;
  if(o!==c) issues.push(p+': div '+o+'/'+c);
  if(/href="\/(?!\/)/.test(html)||/src="\/(?!\/)/.test(html)) issues.push(p+': absolute path left');
}
console.log('MISSING:',missing.length); missing.forEach(m=>console.log('  '+m));
console.log('ISSUES:',issues.length); issues.forEach(m=>console.log('  '+m));
