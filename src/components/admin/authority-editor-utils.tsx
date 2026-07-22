import type { ActionResult } from "@/types/action";
export const authorityInputClass = "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";
export function AuthorityResult({ result }: { result: ActionResult | null }) { if(!result)return null; return <p role="status" className={`rounded-md p-3 text-sm ${result.success?"bg-emerald-50 text-emerald-800":"bg-red-50 text-red-700"}`}>{result.message}</p>; }
export function FieldError({ result, name }: { result: ActionResult | null; name: string }) { if(!result||result.success)return null; const message=result.fieldErrors?.[name]?.[0]; return message?<p className="mt-1 text-xs text-red-600">{message}</p>:null; }
