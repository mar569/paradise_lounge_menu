import React, { useMemo } from 'react';

interface CashbackManagementProps {
    orderAmount: number | null;
    setOrderAmount: (value: number | null) => void;
    deductAmount: number | null;
    setDeductAmount: (value: number | null) => void;
    calculatedCashback: number;
    handleAddCashback: () => void;
    handleDeductCashback: () => void;
    foundUser: { cashback: number } | null;
}

const CashbackManagement: React.FC<CashbackManagementProps> = React.memo(({
    orderAmount,
    setOrderAmount,
    deductAmount,
    setDeductAmount,
    calculatedCashback,
    handleAddCashback,
    handleDeductCashback,
    foundUser
}) => {
    const calculateMaxDeductible = (amount: number | null): number => {
        return amount ? Math.round(amount * 0.1) : 0;
    };

    const maxDeductible = useMemo(() => calculateMaxDeductible(orderAmount), [orderAmount]);

    const handleDeductAmountChange = (value: string) => {
        const numericValue = value ? Number(value) : null;

        // Prevent setting a negative deduction amount
        if (numericValue !== null && numericValue < 0) {
            return;
        }

        // Ensure the deduction amount does not exceed the user's available cashback
        if (foundUser && numericValue !== null && numericValue > foundUser.cashback) {
            return; // Optionally, you can show a toast or alert here
        }

        setDeductAmount(numericValue);
    };

    return (
        <div className="bg-transparent border-1 border-[#394d3e] p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Управление кэшбэком</h2>

            <div className="mb-4">
                <label className="block text-[#98b99c] mb-2">Сумма чека (₽)</label>
                <input
                    type="number"
                    placeholder="Введите сумму"
                    className="w-full p-2 bg-transparent border-1 border-[#3cb755] text-[#fff] rounded hover:bg-[#14502a] transition duration-300 ease-in-out cursor-pointer"
                    value={orderAmount || ''}
                    onChange={(e) => setOrderAmount(e.target.value ? Number(e.target.value) : null)}
                    disabled={!foundUser}
                />
            </div>

            <div className="mb-4">
                <label className="block text-[#98b99c] mb-2 ">
                    Сумма для списания (₽)
                    {orderAmount && <p className="text-xs text-[#ffffff] pt-1"> (Макс: {maxDeductible}₽ - 10% от чека)</p>}
                </label>
                <input
                    type="number"
                    placeholder="Введите сумму для списания"
                    className="w-full p-2 bg-transparent border-1 border-[#3cb755] text-[#fff] rounded hover:bg-[#14502a] transition duration-300 ease-in-out cursor-pointer"
                    value={deductAmount || ''}
                    onChange={(e) => handleDeductAmountChange(e.target.value)}
                    disabled={!foundUser}
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleAddCashback}
                    className="cursor-pointer w-full py-2 bg-[#379461] text-[#fff] rounded hover:bg-[#175530] disabled:opacity-50"
                    disabled={!foundUser || orderAmount === null || calculatedCashback === 0}
                >
                    Начислить {calculatedCashback}₽
                </button>
                <button
                    onClick={handleDeductCashback}
                    className="cursor-pointer w-full py-2 bg-[#ab4040] text-[#fff] rounded hover:bg-[#cc2828] disabled:opacity-50"
                    disabled={!foundUser || !deductAmount}
                >
                    Списать баллы
                </button>
            </div>
        </div>
    );
});

export default CashbackManagement;
