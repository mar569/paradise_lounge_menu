import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../lightswind/dialog';
import { FaExclamationTriangle } from "react-icons/fa";
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../../../services/firebase';
import { toast } from 'react-toastify';
import type { UserData } from './types';
import { useNavigate } from 'react-router-dom';

interface DeleteProfileDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    userData: UserData | null;
}

const DeleteProfileDialog: React.FC<DeleteProfileDialogProps> = ({ isOpen, setIsOpen, userData }) => {
    const navigate = useNavigate();
    const [isDeleted, setIsDeleted] = useState(false); // State to track successful deletion

    const handleDeleteProfile = async () => {
        if (!auth.currentUser || !userData) return;

        // Prompt user for password for re-authentication
        const password = prompt("Введите ваш пароль для подтверждения удаления профиля:");
        if (!password) {
            toast.error('Удаление профиля отменено');
            return;
        }

        // Get the current user's email
        const email = auth.currentUser.email;
        if (!email) {
            toast.error('Не удалось получить адрес электронной почты пользователя.');
            return;
        }

        // Create credentials for re-authentication
        const credential = EmailAuthProvider.credential(email, password);

        try {
            // Re-authenticate the user
            await reauthenticateWithCredential(auth.currentUser, credential);
            // Delete the user's document from Firestore
            await deleteDoc(doc(db, 'users', userData.id));
            // Delete the user from Firebase Auth
            await deleteUser(auth.currentUser);
            toast.success('Профиль успешно удален');
            setIsDeleted(true); // Set state to indicate successful deletion
        } catch (error) {
            console.error('Ошибка удаления:', error);

            // Check for error code
            if (error instanceof Error && error.message) {
                if (error.message.includes('auth/requires-recent-login')) {
                    toast.error('Необходима повторная аутентификация. Пожалуйста, войдите снова.');
                } else {
                    toast.error('Не удалось удалить профиль');
                }
            } else {
                toast.error('Неизвестная ошибка при удалении профиля');
            }
        } finally {
            setIsOpen(false); // Close the dialog after the operation
        }
    };

    // Use useEffect to redirect after deletion
    useEffect(() => {
        if (isDeleted) {
            navigate('/'); // Redirect to the main page after deletion
        }
    }, [isDeleted, navigate]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center gap-3 mb-4">
                    <FaExclamationTriangle className="text-yellow-500 text-xl" />
                    <DialogTitle className="text-lg font-bold">Подтверждение удаления!</DialogTitle>
                </div>
                <DialogDescription className="mb-6 text-gray-200 text-lg">
                    Вы уверены, что хотите полностью удалить свой профиль? Все данные будут безвозвратно утеряны.
                </DialogDescription>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="cursor-pointer px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleDeleteProfile}
                        className="cursor-pointer px-4 py-2 rounded-md bg-[#ba1d1d] text-white hover:bg-red-700"
                    >
                        Удалить
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteProfileDialog;
