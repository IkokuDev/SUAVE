'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  itemName: string;
  itemType: string;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteConfirmationDialog = ({
  isOpen,
  setIsOpen,
  itemName,
  itemType,
  onConfirm,
  loading,
}: DeleteConfirmationDialogProps) => {
  const [confirmationText, setConfirmationText] = useState('');

  const handleConfirm = async () => {
    if (confirmationText === itemName) {
      await onConfirm();
      setConfirmationText(''); // Reset for next time
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) setConfirmationText(''); // Reset on close
      setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>Delete {itemType}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the {itemType} and all associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="confirmation-text">
            To confirm, please type <span className="font-bold text-white">{itemName}</span> below:
          </Label>
          <Input
            id="confirmation-text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="mt-2"
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmationText !== itemName || loading}
          >
            {loading ? `Deleting...` : `Delete ${itemType}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
