"use client";
import { ErrorState } from "@/components/public/error-state";
export default function PublicError({reset}:{reset:()=>void}){return <ErrorState reset={reset}/>}
