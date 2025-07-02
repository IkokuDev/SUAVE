'use client';
import { useState } from 'react';
import type { Client } from '@/lib/definitions';
import Header from './header';
import ClientListPanel from './client-list-panel';
import WelcomePanel from './welcome-panel';
import ClientDetailsPanel from './client-details-panel';

const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <div className="h-screen w-screen grid grid-cols-12 grid-rows-12 gap-4 p-4 bg-background">
      <Header />
      <ClientListPanel setSelectedClient={setSelectedClient} selectedClientId={selectedClient?.id || null}/>
      <main className="col-span-12 md:col-span-8 row-span-11 bg-card rounded-lg p-6 flex flex-col shadow-lg">
        {selectedClient ? (
          <ClientDetailsPanel client={selectedClient} />
        ) : (
          <WelcomePanel />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
