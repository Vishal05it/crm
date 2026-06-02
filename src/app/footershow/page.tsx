"use client";

import React from "react";

import { useAllContexts } from "../context/AllContext";
import Footer from "../components/Footer";

export default function FooterWrapper() {
  const { showFooter } = useAllContexts();

  if (!showFooter) return null;

  return <Footer />;
}
