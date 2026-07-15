const fs=require('node:fs');const path=require('node:path');
const file=path.join(process.cwd(),'.env');if(fs.existsSync(file)){for(const line of fs.readFileSync(file,'utf8').split(/\r?\n/)){const match=line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);if(!match||match[1].startsWith('#'))continue;let value=match[2].trim();if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))value=value.slice(1,-1);if(!process.env[match[1]])process.env[match[1]]=value}}
// One-release compatibility for the project's legacy casing. Rename the key in .env to DATABASE_URL.
if(!process.env.DATABASE_URL&&process.env.Database_URL)process.env.DATABASE_URL=process.env.Database_URL;
