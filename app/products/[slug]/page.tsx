import { getContent } from "@/lib/content";
export default function Page({params}:{params:{slug:string}}){
  const c=getContent(); const p=c.products.find((x:any)=>x.slug===params.slug);
  if(!p) return <div>Not found</div>;
  return (<div>
    <h1 className='text-3xl font-semibold'>{p.title}</h1>
    <div className='rounded-2xl p-6 border border-white/10 bg-white/5 mt-6'>
      <table className='w-full text-sm'><tbody>{p.specs.map((s:any)=>(<tr key={s[0]}><th className='text-left pr-4'>{s[0]}</th><td>{s[1]}</td></tr>))}</tbody></table>
    </div>
  </div>)
}
