import { DynamicApiExplorer } from "@/modules/api-explorer/components/DynamicApiExplorer";

export default function ApiExplorerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-8">
        <DynamicApiExplorer />
      </div>
    </div>
  );
}
