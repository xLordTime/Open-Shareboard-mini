import Board from './board';
import {getChatGPTUser} from './chatgpt-auth';
import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getChatGPTUser();return <Board signedIn={!!user && user.email.toLowerCase()===String((env as any).BOARD_OWNER_EMAIL||'').toLowerCase()} name={user?.fullName||'Mein Workspace'}/>}
