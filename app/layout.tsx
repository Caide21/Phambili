import "./globals.css"; import Link from "next/link";
export const metadata={title:"Phambili — Waste to Wealth",description:"Modular, carbon-negative BCT"};
export default function RootLayout({children}:{children:React.ReactNode}){
  const nav=[{href:"/",label:"Home"},{href:"/technology",label:"Technology"},{href:"/products",label:"Products"},{href:"/feedstocks",label:"Feedstocks"},{href:"/investment",label:"Investment"},{href:"/supply-feedstock",label:"Supply Feedstock"}];
  return (<html lang="en"><body>
    <header className="border-b border-white/10"><div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
      <Link href="/" className="font-semibold">Phambili</Link>
      <nav className="flex gap-4">{nav.map(n=><Link key={n.href} href={n.href}>{n.label}</Link>)}</nav>
    </div></header>
    <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
  </body></html>)
}
