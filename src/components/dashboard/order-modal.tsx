'use client';
import { useEffect, useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Order } from '@/lib/definitions';
import { maleMeasurements, femaleMeasurements, maleGarmentOptions } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { getAiSuggestions } from '@/app/actions';
import { Sparkles } from 'lucide-react';
import { Separator } from '../ui/separator';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, setDoc } from 'firebase/firestore';

const orderSchema = z.object({
  date_in: z.string().nonempty("Date in is required."),
  date_out: z.string().nonempty("Date out is required."),
  status: z.string().nonempty("Status is required."),
  instructions: z.string().optional(),
  gender: z.enum(['male', 'female']),
  measurements: z.record(z.string()),
  garment_options: z.record(z.boolean()).optional(),
  tailor_name: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clientId: string;
  order: Order | null;
}

const OrderModal = ({ isOpen, setIsOpen, clientId, order }: OrderModalProps) => {
  const { toast } = useToast();
  const [gender, setGender] = useState<'male' | 'female'>(order?.gender || 'male');
  const [aiSuggestion, setAiSuggestion] = useState(order?.ai_suggestions || '');
  const [isAiLoading, startAiTransition] = useTransition();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      date_in: order?.date_in || new Date().toISOString().split('T')[0],
      date_out: order?.date_out || '',
      status: order?.status || 'Pending',
      instructions: order?.instructions || '',
      gender: order?.gender || 'male',
      measurements: order?.measurements || (gender === 'male' ? maleMeasurements : femaleMeasurements),
      garment_options: order?.garment_options || maleGarmentOptions,
      tailor_name: order?.tailor_name || '',
    },
  });
  
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = form;
  const clientInstructions = watch('instructions');

  useEffect(() => {
    if (order) {
        setGender(order.gender);
        setValue('gender', order.gender);
        setValue('measurements', order.measurements);
        setValue('garment_options', order.garment_options || (order.gender === 'male' ? maleGarmentOptions : {}));
        setValue('tailor_name', order.tailor_name || '');
        setAiSuggestion(order.ai_suggestions || '');
    }
  }, [order, setValue]);


  const handleGenderChange = (newGender: 'male' | 'female') => {
    setGender(newGender);
    setValue('gender', newGender);
    setValue('measurements', newGender === 'male' ? maleMeasurements : femaleMeasurements);
    if(newGender === 'male') {
        setValue('garment_options', maleGarmentOptions)
    } else {
        setValue('garment_options', {})
    }
  };

  const handleAiSuggest = () => {
    if(!clientInstructions) {
        toast({ title: 'Please enter client instructions first.', variant: 'destructive' });
        return;
    }
    startAiTransition(async () => {
        const result = await getAiSuggestions({ gender, instructions: clientInstructions });
        if(result.success) {
            setAiSuggestion(result.suggestions || '');
            toast({title: "AI suggestions generated!"});
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    })
  }

  const onSubmit = async (data: OrderFormData) => {
    const orderData = { ...data, ai_suggestions: aiSuggestion };
    try {
        if (order) { // Editing existing order
            const orderRef = doc(db, 'clients', clientId, 'orders', order.id);
            await setDoc(orderRef, orderData, { merge: true });
            toast({ title: 'Success', description: 'Order updated successfully.' });
        } else { // Creating new order
            await addDoc(collection(db, 'clients', clientId, 'orders'), orderData);
            toast({ title: 'Success', description: 'Order created successfully.' });
        }
        
        form.reset();
        setIsOpen(false);
    } catch (error) {
        console.error('Error saving order:', error);
        toast({ title: 'Error', description: 'Failed to save order. Please check your Firestore security rules in the Firebase console.', variant: 'destructive' });
    }
  };

  const measurementFields = gender === 'male' ? maleMeasurements : femaleMeasurements;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-4xl h-[90vh] flex flex-col bg-card">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{order ? 'Edit Order' : 'New Order'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow p-6 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label htmlFor="date-in">Date In</Label>
                  <Input id="date-in" type="date" {...register('date_in')} />
                  {errors.date_in && <p className="text-red-500 text-xs mt-1">{errors.date_in.message}</p>}
                </div>
                <div>
                  <Label htmlFor="date-out">Date Out</Label>
                  <Input id="date-out" type="date" {...register('date_out')} />
                  {errors.date_out && <p className="text-red-500 text-xs mt-1">{errors.date_out.message}</p>}
                </div>
                <div>
                    <Label htmlFor="tailor-name">Tailor Name</Label>
                    <Input id="tailor-name" {...register('tailor_name')} placeholder="Enter tailor's name"/>
                    {errors.tailor_name && <p className="text-red-500 text-xs mt-1">{errors.tailor_name.message as string}</p>}
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor="order-status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                   {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                </div>
              </div>

              <div className="mb-6">
                <Label>Gender for Measurements</Label>
                <div className="flex space-x-4 mt-2">
                  <Button type="button" onClick={() => handleGenderChange('male')} className={`flex-1 ${gender === 'male' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>Male</Button>
                  <Button type="button" onClick={() => handleGenderChange('female')} className={`flex-1 ${gender === 'female' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>Female</Button>
                </div>
              </div>

              <Label className="font-semibold">Measurements</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2">
                {Object.keys(measurementFields).map(key => (
                  <div key={key}>
                    <Label htmlFor={`mes-${key.replace(/\s|\//g, '')}`} className="text-xs text-muted-foreground">{key}</Label>
                    <Input id={`mes-${key.replace(/\s|\//g, '')}`} {...register(`measurements.${key}`)} className="!p-2 text-sm" />
                  </div>
                ))}
              </div>
              
              {gender === 'male' && (
                <>
                  <Label className="font-semibold mt-8 mb-4 block border-t border-border pt-4">Garment Details</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(maleGarmentOptions).map(key => (
                      <div key={key} className="flex items-center space-x-3 bg-accent p-3 rounded-lg">
                        <Controller
                          name={`garment_options.${key}`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox id={`opt-${key}`} checked={field.value} onCheckedChange={field.onChange} />
                          )}
                        />
                        <Label htmlFor={`opt-${key}`} className="text-sm font-normal text-gray-300">{key}</Label>
                      </div>
                    ))}
                  </div>
                </>
              )}
                
              <div className="mt-6">
                <Label htmlFor="client-instructions">Client's Instructions</Label>
                <Textarea id="client-instructions" rows={4} {...register('instructions')} />
              </div>

              <div className='mt-4'>
                <Button type="button" onClick={handleAiSuggest} disabled={isAiLoading}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isAiLoading ? 'Getting suggestions...' : 'Get AI Suggestions'}
                </Button>
              </div>

              {aiSuggestion && (
                <div className="mt-4">
                    <Label htmlFor="ai-suggestions" className="font-semibold">AI Suggestions</Label>
                    <Separator className='my-2'/>
                    <Textarea id="ai-suggestions" readOnly value={aiSuggestion} rows={5} className="bg-accent/50" />
                </div>
              )}
          </ScrollArea>
          <DialogFooter className="flex-shrink-0 p-6 border-t border-gray-700">
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (order ? 'Save Changes' : 'Save Order')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
