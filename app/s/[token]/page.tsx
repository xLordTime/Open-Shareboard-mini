import {bucket,getFile} from '../../../lib/storage';
import Viewer from '../../viewer';
export const dynamic='force-dynamic';
export default async function Shared({params}:any){const {token}=await params;if(!/^[a-f0-9-]{72}$/.test(token))return <main className="unavailable"><h1>Link nicht verfügbar</h1></main>;const o=await bucket().get(`shares/${token}`);const m=o?await getFile(await o.text()):null;if(!m||m.token!==token)return <main className="unavailable"><h1>Diese Freigabe ist nicht mehr verfügbar.</h1><a href="/">Zum Shareboard</a></main>;const {owner,...file}=m;return <Viewer file={file} shared token={token}/>}
