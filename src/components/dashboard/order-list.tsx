'use client';
import { useState, useEffect } from 'react';
import type { Order } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';


interface OrderListProps {
  clientId: string;
  onEditOrder: (order: Order) => void;
}

const getStatusVariant = (status: string) => {
    switch(status) {
        case 'Completed': return 'default';
        case 'Ready for Pickup': return 'default';
        case 'In Progress': return 'secondary';
        case 'Pending': return 'destructive';
        default: return 'outline';
    }
}

const OrderList = ({ clientId, onEditOrder }: OrderListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    setLoading(true);
    const q = query(
        collection(db, "clients", clientId, "orders"),
        orderBy("date_in", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
            ordersData.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ordersData);
        setLoading(false);
    }, (error) => {
        console.error(`Error fetching orders for client ${clientId}:`, error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  if (loading) {
    return (
        <div className="flex-grow overflow-y-auto pr-2 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-accent p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>
            ))}
        </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground flex-grow flex flex-col items-center justify-center">
        <p className="text-lg">No orders found for this client.</p>
        <p>Click "New Order" to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto pr-2">
      {orders.map(order => (
        <div
          key={order.id}
          className="bg-accent p-4 rounded-lg mb-3 cursor-pointer hover:bg-secondary transition-colors"
          onClick={() => onEditOrder(order)}
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
            <div>
              <p className="font-bold text-white">{order.order_name}</p>
              <p className="text-sm text-muted-foreground">Due: {order.date_out}</p>
            </div>
            <Badge 
              className={
                `${order.status === 'Completed' || order.status === 'Ready for Pickup' ? 'bg-green-600' : 'bg-yellow-600'} text-white self-start sm:self-auto`
              }
            >
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
