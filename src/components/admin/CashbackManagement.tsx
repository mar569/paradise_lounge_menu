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

        if (numericValue !== null && numericValue < 0) {
            return;
        }

        if (foundUser && numericValue !== null && numericValue > foundUser.cashback) {
            return;
        }

        setDeductAmount(numericValue);
    };

    return (
        <div className="bg-transparent border-2 border-[#87679b] p-4 rounded-lg">
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
                {/* Первый элемент */}
                <div
                    onClick={handleAddCashback}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleAddCashback();
                        }
                    }}
                    className={`cursor-pointer w-full py-2 rounded flex justify-center items-center ${!foundUser || orderAmount === null || calculatedCashback === 0
                        ? 'bg-[#379461] opacity-50 pointer-events-none'
                        : 'bg-[#379461] hover:bg-[#175530]'
                        } text-white transition duration-300`}
                >
                    Начислить {calculatedCashback}₽
                </div>

                {/* Второй элемент */}
                <div
                    onClick={handleDeductCashback}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleDeductCashback();
                        }
                    }}
                    className={`cursor-pointer w-full py-2 rounded flex justify-center items-center ${!foundUser || !deductAmount
                        ? 'bg-[#ab4040] opacity-50 pointer-events-none'
                        : 'bg-[#ab4040] hover:bg-[#cc2828]'
                        } text-white transition duration-300`}
                >
                    Списать баллы
                </div>
            </div>
        </div>
    );
});

export default CashbackManagement;
