'use client';
import { useState } from 'react';
import type { Client } from '@/lib/definitions';
import Header from './header';
import ClientListPanel from './client-list-panel';
import WelcomePanel from './welcome-panel';
import ClientDetailsPanel from './client-details-panel';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const isMobile = useIsMobile();

  // On mobile, we show EITHER the list OR the details.
  if (isMobile) {
    return (
      <div className="h-screen w-screen flex flex-col gap-4 p-4 bg-background">
        <Header />
        <div className={cn("flex-grow bg-card rounded-lg shadow-lg overflow-y-auto", selectedClient ? 'p-4 sm:p-6' : 'p-4')}>
          {selectedClient ? (
            <ClientDetailsPanel client={selectedClient} setSelectedClient={setSelectedClient} />
          ) : (
            <ClientListPanel setSelectedClient={setSelectedClient} selectedClientId={null} />
          )}
        </div>
      </div>
    );
  }

  // On desktop, we show both side-by-side.
  return (
    <div className="h-screen w-screen grid grid-cols-12 grid-rows-12 gap-4 p-4 bg-background">
      <Header />
      <aside className="col-span-12 md:col-span-4 row-span-11 bg-card rounded-lg p-4 flex flex-col shadow-lg">
        <ClientListPanel setSelectedClient={setSelectedClient} selectedClientId={selectedClient?.id || null}/>
      </aside>
      <main className="col-span-12 md:col-span-8 row-span-11 bg-card rounded-lg p-6 flex flex-col shadow-lg">
        {selectedClient ? (
          <ClientDetailsPanel client={selectedClient} setSelectedClient={setSelectedClient} />
        ) : (
          <WelcomePanel />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
