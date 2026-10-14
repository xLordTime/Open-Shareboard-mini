import { env } from 'cloudflare:workers';
import {HttpError} from './security';
export const bucket=()=>{const b=(env as any).BUCKET as R2Bucket;if(!b)throw new Error('Speicher nicht verfügbar');return b};
export const metaKey=(id:string)=>`meta/${id}`;
export async function getFile(id:string){if(!/^[a-f0-9-]{36}$/.test(id))return null;const o=await bucket().get(metaKey(id));return o?o.json<any>():null}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin}
export const json=(data:any,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export function safeType(name:string){const e=name.split('.').pop()?.toLowerCase();return ({pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',mp4:'video/mp4',webm:'video/webm',mp3:'audio/mpeg',wav:'audio/wav',txt:'text/plain',md:'text/plain'} as any)[e||'']||'application/octet-stream'}
export async function ownFiles(owner:string){const prefix=`users/${owner}/`;const list=await bucket().list({prefix,limit:500});const items=await Promise.all(list.objects.map(o=>getFile(o.key.slice(prefix.length))));return items.filter(Boolean)}
export async function folder(id:string){if(!/^[a-f0-9-]{36}$/.test(id))return null;const o=await bucket().get(`folders/${id}`);return o?o.json<any>():null}
export async function ownFolders(owner:string){const prefix=`folder-users/${owner}/`;const list=await bucket().list({prefix,limit:100});return (await Promise.all(list.objects.map(o=>folder(o.key.slice(prefix.length))))).filter(Boolean)}
export async function readable(m:any,uid:string|undefined,token:string|null){if(uid===m.owner)return true;if(!token||!(/^[a-f0-9-]{72}$/.test(token)))return false;if(m.token===token&&(!m.expires||Date.parse(m.expires)>Date.now()))return true;if(!m.folder)return false;const f=await folder(m.folder);return !!f&&f.owner===m.owner&&f.token===token&&(!f.expires||Date.parse(f.expires)>Date.now())}
export async function updateMeta(id:string,update:(m:any)=>Promise<any>){const obj=await bucket().get(metaKey(id));if(!obj)return null;const m=await obj.json<any>();const next=await update(m);const put=await bucket().put(metaKey(id),JSON.stringify(next),{onlyIf:{etagMatches:obj.etag}});if(!put)throw new HttpError(409,'Datei wurde parallel geändert. Bitte aktualisieren.');return next}
