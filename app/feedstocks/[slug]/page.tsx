import { getContent } from "@/lib/content";
export default function Page({params}:{params:{slug:string}}){
  const c=getContent(); const f=c.feedstocks.find((x:any)=>x.slug===params.slug);
  if(!f) return <div>Not found</div>;
  return (<div>
    <h1 className='text-3xl font-semibold'>{f.title}</h1>
    <div className='grid md:grid-cols-2 gap-6 mt-6'>
      <div className='rounded-2xl p-6 border border-white/10 bg-white/5'><h3 className='text-xl font-semibold'>Problems</h3><ul className='list-disc ml-6 mt-2'>{f.problems.map((p:string)=>(<li key={p}>{p}</li>))}</ul></div>
      <div className='rounded-2xl p-6 border border-white/10 bg-white/5'><h3 className='text-xl font-semibold'>Typical Yields</h3><table className='w-full text-sm mt-2'><tbody>{Object.entries(f.yields).map(([k,v]:any)=>(<tr key={k}><th className='text-left pr-4'>{k}</th><td>{v}</td></tr>))}</tbody></table></div>
    </div>
    {f.cta && <div className='rounded-2xl p-6 border border-white/10 bg-white/5 mt-6'><strong>Next:</strong> {f.cta}</div>}
  </div>)
}
