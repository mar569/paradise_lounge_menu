import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './lightswind/dialog';


interface AgeVerificationModalProps {
    onConfirm: () => void;
    onDeny: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onConfirm, onDeny }) => {
    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Вам уже есть 18 лет?</DialogTitle>
                    <DialogDescription>
                        Пожалуйста, подтвердите, что вам уже есть 18 лет, чтобы продолжить.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button onClick={onConfirm} className="btn">Да</button>
                    <button onClick={onDeny} className="btn">Нет</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AgeVerificationModal;
