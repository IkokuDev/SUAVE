'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Client } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ClientModal from './client-modal';
import { Skeleton } from '../ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

interface ClientListPanelProps {
  setSelectedClient: (client: Client) => void;
  selectedClientId: string | null;
}

const ClientListPanel = ({ setSelectedClient, selectedClientId }: ClientListPanelProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(
        collection(db, "clients"), 
        orderBy("name")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const clientsData: Client[] = [];
        querySnapshot.forEach((doc) => {
            clientsData.push({ id: doc.id, ...doc.data() } as Client);
        });
        setClients(clientsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching clients:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl font-bold mb-2">Clients</h2>
        <div className="flex space-x-2">
          <Input
            type="text"
            id="client-search"
            placeholder="Search clients..."
            className="flex-grow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)} className="flex-shrink-0" aria-label="Add new client">
            <Plus />
          </Button>
        </div>
      </div>
      <div id="client-list" className="flex-grow overflow-y-auto pr-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg mb-2">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${selectedClientId === client.id ? 'bg-primary/20' : 'hover:bg-accent'}`}
            >
              <p className="font-semibold text-white">{client.name}</p>
              <p className="text-sm text-muted-foreground">{client.phone || ''}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center mt-4">No clients found.</p>
        )}
      </div>
      <ClientModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default ClientListPanel;
