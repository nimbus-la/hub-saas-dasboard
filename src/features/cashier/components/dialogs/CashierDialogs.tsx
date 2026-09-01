"use client";

import CloseCashDialog from "./CloseCashDialog";
import OpenCashDialog from "./OpenCashDialog";

interface CashierDialogsProps {
    showOpenDialog: boolean;
    showCloseDialog: boolean;

    initialAmount: number;
    cashSales: number;

    onCloseOpenDialog: () => void;
    onConfirmOpenDialog: (amount: number) => void;

    onCloseCloseDialog: () => void;
    onConfirmCloseDialog: () => void;
}

export default function CashierDialogs({
    showOpenDialog,
    showCloseDialog,
    initialAmount,
    cashSales,
    onCloseOpenDialog,
    onConfirmOpenDialog,
    onCloseCloseDialog,
    onConfirmCloseDialog,
}: CashierDialogsProps) {
    return (
        <>
            <OpenCashDialog
                isOpen={showOpenDialog}
                onClose={onCloseOpenDialog}
                onConfirm={onConfirmOpenDialog}
            />

            <CloseCashDialog
                isOpen={showCloseDialog}
                initialAmount={initialAmount}
                cashSales={cashSales}
                onClose={onCloseCloseDialog}
                onConfirm={onConfirmCloseDialog}
            />
        </>
    );
}