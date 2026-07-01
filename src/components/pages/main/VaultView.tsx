"use client";

import { useState } from "react";

import {
  Search,
  FolderSync,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import DocumentList from "@/components/ui/DocumentList";
import { supabase } from "@/lib/client";
import { handler } from "next/dist/server/route-modules/pages/builtin/_error";

interface VaultViewProps {
  documents: any[];
}

export default function VaultView({ documents }: VaultViewProps) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>(
    {},
  );

  // for search query
  const filteredDocs = documents.filter((doc) =>
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // grouping
  const timelineGroups: Record<string, Record<string, any[]>> = {};

  filteredDocs.forEach((doc) => {
    let year = "unsorted";
    let month = "No Date";

    if (doc.due_date) {
      const dateObj = new Date(doc.due_date);
      if (!isNaN(dateObj.getTime())) {
        year = dateObj.getFullYear().toString();
        month = dateObj.toLocaleString("en-US", { month: "long" });
      }
    }

    if (!timelineGroups[year]) timelineGroups[year] = {};
    if (!timelineGroups[year][month]) timelineGroups[year][month] = [];

    timelineGroups[year][month].push(doc);
  });

  // sorting
  const sortedYears = Object.keys(timelineGroups).sort((a, b) => {
    if (a === "Unsorted") return 1;
    if (b === "Unsorted") return -1;
    return b.localeCompare(a);
  });

  // "more content" toggle
  const toggleMonth = (yearMonthKey: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [yearMonthKey]: !prev[yearMonthKey],
    }));
  };

  // bulk delete
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const bulkDelete = async () => {
    const { error } = await supabase
      .from("documents")
      .delete()
      .in("id", selectedIds);
  };
  return (
    <div className="space-y-8">
      <section className="space-y-1 px-1">
        <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          The Vault
        </h1>
        <p className="font-mono text-xs md:text-sm font-medium text-muted pt-1 tracking-tight leading-relaxed">
          Your permanent archive of chronological paperwork
        </p>
      </section>

      <section className="relative w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search files by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-slate-500 rounded-xl font-sans text-left pl-11 text-sm font-medium p-2 shadow-md outline-none focus:border-accent transition-colors"
        />
      </section>

      {filteredDocs.length === 0 && (
        <div className="text-center py-16 border-border-light rounded-2xl font-sans text-slate-400 text-sm">
          No matching documents found.
        </div>
      )}

      <section className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border border-border-light p-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds([]);
            }}
            className={`
              px-4 py-2 text-md font-sans font-bold border rounded-lg shadow-sm transition-all active:scale-95 ${
                isSelectionMode
                  ? "bg-slate-900 border-slate-950 text-white hover:bg-slate-800"
                  : "bg-surface border-border-mid text-slate-600 hover:bg-slate-50"
              }
              `}
          >
            {isSelectionMode ? "Cancel" : "Select Items"}
          </button>
          <div>
            {isSelectionMode ? (
              <div className="space-x-2">
                <span className="font-mono font-medium text-sm">
                  {selectedIds.length} SELECTED
                </span>
                <button
                  type="button"
                  onClick={bulkDelete}
                  className="px-4 py-2 text-md font-bold text-red-600 border border-red-500 bg-white hover:bg-red-600 hover:text-white disabled:bg-red-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
                >
                  Delete
                </button>
              </div>
            ) : (
              <p className="font-mono text-xs font-bole text-muted uppercase tracking-wider">
                Viewing Archive
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        {sortedYears.map((year) => (
          <div key={year} className="space-y-4">
            {/* Year Separator Badge */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-2 px-1">
              <CalendarDays size={16} className="text-ink" />
              <h2 className="font-sans font-extrabold text-lg text-slate-900 tracking-tight">
                {year}
              </h2>
            </div>

            {/* Months inside this Year */}
            <div className="space-y-3 pl-1">
              {Object.keys(timelineGroups[year]).map((month) => {
                const yearMonthKey = `${year}-${month}`;
                const isExpanded = !!expandedMonths[yearMonthKey];
                const itemsCount = timelineGroups[year][month].length;

                return (
                  <div key={month} className="space-y-3">
                    {/* Collapsible Month Accordion Header Bar */}
                    <button
                      onClick={() => toggleMonth(yearMonthKey)}
                      className="w-full bg-surface border border-border-light rounded-xl p-3.5 flex items-center justify-between shadow-sm hover:bg-slate-50/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <FolderSync size={16} className="text-slate-400" />
                        <span className="font-sans text-sm font-bold text-slate-800">
                          {month}
                        </span>
                        <span className="font-mono text-[10px] font-extrabold bg-slate-100 px-2 py-0.5 border border-border-light text-muted rounded-md uppercase tracking-wider">
                          {itemsCount} {itemsCount === 1 ? "Item" : "Items"}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    </button>

                    {/* Smooth expansion of matching Documents rows */}
                    {isExpanded && (
                      <div className="animate-fade-in">
                        <DocumentList
                          documents={timelineGroups[year][month]}
                          hasMode={isSelectionMode}
                          selectedIds={selectedIds}
                          onToggleSelect={handleToggleSelect}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
