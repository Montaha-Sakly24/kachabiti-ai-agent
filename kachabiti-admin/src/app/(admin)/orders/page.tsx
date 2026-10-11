import OrdersList from "@/components/orders/OrdersList";

export default function OrdersPage() {
  return (
    <div className="px-8 py-7 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="font-display text-2xl text-coffee">Commandes</h1>
        <p className="text-sm text-coffee-soft mt-1">
          Coordonnées des clients ayant confirmé une commande — à traiter manuellement.
        </p>
      </header>
      <OrdersList />
    </div>
  );
}
