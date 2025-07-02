'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const clientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
});

interface ClientModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ClientModal = ({ isOpen, setIsOpen }: ClientModalProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '', phone: '', email: '' },
  });

  const onSubmit = async (values: z.infer<typeof clientSchema>) => {
    try {
      await addDoc(collection(db, "clients"), values);

      toast({ title: "Success", description: "Client added successfully." });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding client: ", error);
      toast({ title: "Error", description: "Failed to add client. Make sure your Firebase API keys are correct.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>New Client</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Client'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientModal;
