import Link from "next/link";import {getContent} from "../lib/content";
export default function Page(){
  const c=getContent();
  return (<div>
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5">
      <h1 className="text-3xl font-semibold">Phambili — Turning Waste into Wealth</h1>
      <p className="text-white/80 mt-3">Modular BCT converts waste into products & audited carbon credits.</p>
      <div className="mt-6 flex gap-3 flex-wrap">
        <Link className="underline" href="/a/technical">Technical Reviewer</Link>
        <Link className="underline" href="/a/financial">Financial Reviewer</Link>
        <Link className="underline" href="/a/buyers">Product Buyer</Link>
        <Link className="underline" href="/a/suppliers">Feedstock Supplier</Link>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-4 mt-8">
      {c.feedstocks.map((f:any)=>(<div key={f.slug} className="rounded-2xl p-6 border border-white/10 bg-white/5"><a href={'/feedstocks/'+f.slug}>{f.title}</a></div>))}
    </div>
  </div>)
}
