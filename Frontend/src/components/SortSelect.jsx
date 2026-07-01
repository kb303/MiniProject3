import { useState } from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { SORT_OPTIONS } from "../data/index.js";

export default function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowUpDown className="w-3 h-3" />
        {current.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-44 bg-popover border border-border rounded-xl shadow-xl z-20 py-1 overflow-hidden">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2 text-xs transition-colors ${
                  value === opt.value
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {opt.label}
                {value === opt.value && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
