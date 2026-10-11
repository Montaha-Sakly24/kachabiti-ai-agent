import FaqManager from "@/components/faq/FaqManager";

export default function FaqsPage() {
  return (
    <div className="px-8 py-7 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="font-display text-2xl text-coffee">Base de connaissances</h1>
        <p className="text-sm text-coffee-soft mt-1">
          Les questions et réponses que le chatbot utilise pour répondre aux clients.
        </p>
      </header>
      <FaqManager />
    </div>
  );
}
