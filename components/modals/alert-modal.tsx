import React, { useEffect, useState } from "react";
// import Modal from "./modal";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const AlertModal = ({ isOpen, onClose, onConfirm, loading }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Are you sure"
      description="You are about to delete the current item. This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 items-center justify-end w-full">
        <Button variant="outline" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={onConfirm} variant={"destructive"}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
