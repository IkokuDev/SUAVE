'use client';

import { useState } from 'react';
import type { Client, Order as OrderType } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import OrderList from './order-list';
import OrderModal from './order-modal';
import DeleteConfirmationDialog from './delete-confirmation-dialog';
import { Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface ClientDetailsPanelProps {
  client: Client;
  setSelectedClient: (client: Client | null) => void;
}

const ClientDetailsPanel = ({ client, setSelectedClient }: ClientDetailsPanelProps) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();


  const handleNewOrder = () => {
    setSelectedOrder(null);
    setIsOrderModalOpen(true);
  };
  
  const handleEditOrder = (order: OrderType) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleDeleteClient = async () => {
    setIsDeleting(true);
    try {
      // Delete all orders for the client
      const ordersQuery = query(collection(db, 'clients', client.id, 'orders'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const deletePromises: Promise<void>[] = [];
      ordersSnapshot.forEach((orderDoc) => {
        deletePromises.push(deleteDoc(doc(db, 'clients', client.id, 'orders', orderDoc.id)));
      });
      await Promise.all(deletePromises);

      // Delete the client document
      await deleteDoc(doc(db, 'clients', client.id));

      toast({ title: "Success", description: "Client and all associated orders deleted successfully." });
      setSelectedClient(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting client: ", error);
      toast({ title: "Error", description: "Failed to delete client.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-4 pb-4 border-b border-primary">
        <div>
          <h2 className="text-3xl font-bold">{client.name}</h2>
          <p className="text-muted-foreground">{client.phone || ''} | {client.email || ''}</p>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={handleNewOrder} className="font-semibold transition hover:-translate-y-0.5">New Order</Button>
            <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" size="icon" aria-label="Delete Client">
                <Trash2 />
            </Button>
        </div>
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
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        itemName={client.name}
        itemType="client"
        onConfirm={handleDeleteClient}
        loading={isDeleting}
      />
    </div>
  );
};

export default ClientDetailsPanel;
