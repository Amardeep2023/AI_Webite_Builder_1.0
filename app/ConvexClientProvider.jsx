"use client";
import React from 'react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import process from 'process';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function ConvexClientProvider({children}) {
  return (
     <ConvexProvider client={convex}>{children}</ConvexProvider>
  )
}

export default ConvexClientProvider
