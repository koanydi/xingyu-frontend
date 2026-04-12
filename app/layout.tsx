import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "星屿文化传媒工作室 | AI软件开发",
  description: "专业的AI软件开发服务，提供小程序、App、Web、企业系统等全栈开发，极速交付，品质保障。",
  keywords: "AI开发,软件开发,小程序开发,App开发,星屿文化传媒",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
