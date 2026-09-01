"use client";

import { useState } from "react";

export default function useCashRegister() {
    const [isCashOpen, setIsCashOpen] =
        useState(false);

    const [initialAmount, setInitialAmount] =
        useState(0);

    const [showOpenDialog, setShowOpenDialog] =
        useState(false);

    const [showCloseDialog, setShowCloseDialog] =
        useState(false);

    const handleOpenCash = () => {
        setShowOpenDialog(true);
    };

    const handleConfirmOpenCash = (
        amount: number,
    ) => {
        setInitialAmount(amount);
        setIsCashOpen(true);
        setShowOpenDialog(false);
    };

    const handleCloseDialog = () => {
        setShowOpenDialog(false);
    };

    const handleCloseCash = () => {
        setShowCloseDialog(true);
    };

    const handleConfirmCloseCash = () => {
        setShowCloseDialog(false);
        setIsCashOpen(false);
        setInitialAmount(0);
    };

    const handleCloseCashDialog = () => {
        setShowCloseDialog(false);
    };

    return {
        isCashOpen,
        initialAmount,
        showOpenDialog,
        showCloseDialog,
        handleOpenCash,
        handleConfirmOpenCash,
        handleCloseDialog,
        handleCloseCash,
        handleConfirmCloseCash,
        handleCloseCashDialog,
    };
}