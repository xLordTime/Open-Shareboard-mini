'use client';
import {useState} from 'react';
import {Layers,FileText,ArrowUpRight} from 'lucide-react';
import Viewer from './viewer';
import type {Entry} from './board';
export default function Collection({name,files,token}:{name:string;files:Entry[];token:string}){const [current,setCurrent]=useState<Entry|null>(null);if(current)return <Viewer file={current} shared token={token} onClose={()=>setCurrent(null)}/>;return <main className="collection-page"><a className="brand" href="/"><Layers/> shareboard <small>STUDIO</small></a><div className="eyebrow">GETEILTE SAMMLUNG</div><h1>{name}</h1><p>{files.length} Dateien · Freigegeben zum Ansehen und Herunterladen</p><div className="collection-grid">{files.map(f=><button key={f.id} onClick={()=>setCurrent(f)}><FileText size={28}/><strong>{f.name}</strong><small>{(f.size/1024/1024).toFixed(1)} MB</small><ArrowUpRight size={18}/></button>)}</div>{!files.length&&<p>Dieser Ordner ist derzeit leer.</p>}</main>}
