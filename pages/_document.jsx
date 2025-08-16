// pages/_document.jsx
import { Html, Head, Main, NextScript } from "next/document";

const noFlash = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      if (!stored || stored === 'system') {
        var mql = window.matchMedia('(prefers-color-scheme: dark)');
        if (mql.matches) document.documentElement.classList.add('dark');
      } else if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
