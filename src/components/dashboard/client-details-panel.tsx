'use client';

import { useState } from 'react';
import type { Client, Order as OrderType } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import OrderList from './order-list';
import OrderModal from './order-modal';

interface ClientDetailsPanelProps {
  client: Client;
}

const ClientDetailsPanel = ({ client }: ClientDetailsPanelProps) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setIsOrderModalOpen(true);
  };
  
  const handleEditOrder = (order: OrderType) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-4 pb-4 border-b border-primary">
        <div>
          <h2 className="text-3xl font-bold">{client.name}</h2>
          <p className="text-muted-foreground">{client.phone || ''} | {client.email || ''}</p>
        </div>
        <Button onClick={handleNewOrder} className="font-semibold transition hover:-translate-y-0.5">New Order</Button>
      </div>
      <OrderList clientId={client.id} onEditOrder={handleEditOrder} />
      {isOrderModalOpen && (
        <OrderModal
          isOpen={isOrderModalOpen}
          setIsOpen={setIsOrderModalOpen}
          clientId={client.id}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default ClientDetailsPanel;
