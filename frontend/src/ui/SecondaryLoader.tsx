import { Loader2Icon } from "lucide-react"

export function SecondaryLoader() {
  return (
    <div className="flex items-center justify-center">
      <button 
        className="w-full bg-neutral-800 border border-neutral-700 text-neutral-400 font-semibold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center gap-2 cursor-not-allowed" 
        disabled
      >
        <Loader2Icon className="animate-spin w-4 h-4" />
        Please wait
      </button>
    </div>
  )
}