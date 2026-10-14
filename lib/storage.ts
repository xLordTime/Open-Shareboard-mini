import { env } from 'cloudflare:workers';
export const bucket=()=>{const b=(env as any).BUCKET as R2Bucket;if(!b)throw new Error('Speicher nicht verfügbar');return b};
export const metaKey=(id:string)=>`meta/${id}`;
export async function getFile(id:string){if(!/^[a-f0-9-]{36}$/.test(id))return null;const o=await bucket().get(metaKey(id));return o?o.json<any>():null}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin}
export const json=(data:any,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export function safeType(name:string){const e=name.split('.').pop()?.toLowerCase();return ({pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',mp4:'video/mp4',webm:'video/webm',mp3:'audio/mpeg',wav:'audio/wav',txt:'text/plain',md:'text/plain'} as any)[e||'']||'application/octet-stream'}
