import ChatWindow from "@/components/playground/ChatWindow";

export default function PlaygroundPage() {
  return (
    <div className="px-8 py-7 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="font-display text-2xl text-coffee">Playground</h1>
        <p className="text-sm text-coffee-soft mt-1">
          Teste le chatbot en conditions réelles, avant de le mettre entre les mains des clients.
        </p>
      </header>
      <ChatWindow />
    </div>
  );
}
