import InboxList from "@/components/inbox/InboxList";

export default function InboxPage() {
  return (
    <div className="px-8 py-7 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="font-display text-2xl text-coffee">Boîte de réception</h1>
        <p className="text-sm text-coffee-soft mt-1">
          Questions clients auxquelles le chatbot n&apos;a pas su répondre — reprends la main ici.
        </p>
      </header>
      <InboxList />
    </div>
  );
}
