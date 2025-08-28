// // pages/[slug].js
// import { useRouter } from "next/router";

// export default function CmsPage() {
//   const { query } = useRouter();
//   const slug = (query.slug || "").toString();

//   // TODO: Load your JSON/CMS content for 'slug' here.
//   // For now, render something obvious:
//   return (
//     <div className="mx-auto max-w-[1100px] px-6 py-10">
//       <h1 className="text-3xl sm:text-4xl font-bold text-emerald-50 mb-2">
//         {slug.charAt(0).toUpperCase() + slug.slice(1)}
//       </h1>
//       <p className="text-emerald-100/90">This is a CMS-driven page for “{slug}”.</p>
//     </div>
//   );
// }

// // Let the layout set the <title>
// CmsPage.shell = ({ slug }) => ({
//   title: slug ? `${slug.charAt(0).toUpperCase() + slug.slice(1)}` : "Page",
//   showNav: true,
//   showFooter: true,
// });
