"use client";
import { Suspense } from "react";
import HomePage from "@/app/page";

// /products 复用首页商品列表（也可独立实现）
export default function ProductsPage() {
  return <HomePage />;
}
