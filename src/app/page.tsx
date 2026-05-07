import UploadDoc from "@/components/UploadDoc";
export default function Home() {
  return (
    <main className="min-h-screen p-12 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">My Anxiety vault</h1>
        <section className="bg-white p-6 roundedxl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Upload New Document
          </h2>
          <UploadDoc />
        </section>
      </div>
    </main>
  );
}
