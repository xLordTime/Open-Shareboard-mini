import {bucket,folder,ownFiles} from '../../../lib/storage';
import Collection from '../../collection';
export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};
export default async function Page({params}:any){const {token}=await params;if(!/^[a-f0-9-]{72}$/.test(token))return <main className="unavailable"><h1>Sammlung nicht verfügbar.</h1></main>;const o=await bucket().get(`collections/${token}`);const f=o?await folder(await o.text()):null;if(!f||f.token!==token||(f.expires&&Date.parse(f.expires)<=Date.now()))return <main className="unavailable"><h1>Sammlung nicht mehr verfügbar.</h1></main>;const files=(await ownFiles(f.owner)).filter(m=>m.folder===f.id).map(({owner,token,expires,...m})=>m);return <Collection name={f.name} files={files} token={token}/>}
