// ProfileHeader.tsx
import React, { useState } from 'react';
import { FaGear } from "react-icons/fa6";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../lightswind/dialog';
import type { UserData } from './types';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';
import { auth, db } from '../../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface ProfileHeaderProps {
    userData: UserData | null;
    onLogout: () => void;
    onEditProfile: (newName: string) => void;
    onPasswordReset: (email: string) => Promise<void>;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    onUpdateProfile: (data: UserData) => void; // Добавлено
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    userData,
    onLogout,
    onEditProfile,
    onPasswordReset,
    setIsDeleteDialogOpen,
    onUpdateProfile,
}) => {
    const [name, setName] = useState(userData?.name || '');
    const dob = userData?.dateOfBirth || ''; // Используем dateOfBirth из userData

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Введите имя');
            return;
        }

        try {
            const userRef = doc(db, 'users', auth.currentUser?.uid || '');

            // Подготовка данных для обновления
            const updateData: {
                name: string;
                dateOfBirth: string;
                avatarUrl?: string;
            } = {
                name: DOMPurify.sanitize(name),
                dateOfBirth: dob,
            };

            // Включаем avatarUrl только если он определен
            if (userData?.avatarUrl) {
                updateData.avatarUrl = userData.avatarUrl;
            }

            await updateDoc(userRef, updateData);

            if (userData) {
                onUpdateProfile({
                    ...userData,
                    name,
                });
            }

            onEditProfile(name);
            toast.success('Профиль успешно обновлен');
        } catch (err) {
            toast.error('Ошибка при сохранении профиля: ' + (err as Error).message);
        }
    };

    return (
        <div className='flex justify-between items-center'>
            <h4 className="text-xl text-[#fff] font-semibold">Профиль</h4>
            <Dialog>
                <DialogTrigger>
                    <span className="flex items-center">
                        <FaGear className="h-5 w-5 text-[#d7f5ec] cursor-pointer " />
                    </span>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle className='text-[#fff] text-[20px] mb-4'
                        style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>Редактировать профиль</DialogTitle>
                    <DialogDescription>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#dcdada]">Имя</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 cursor-pointer block w-full px-3 py-2 border-1 border-[#bceedf] rounded-md shadow-sm focus:outline-none focus:ring-[#7eefb7] focus:border-[#7eefb7]"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#dcdada]">Дата рождения</label>
                            <input
                                type="date"
                                value={dob}
                                disabled={true} // Отключаем редактирование
                                className="mt-1 cursor-pointer block w-full px-3 py-2 border-1 border-[#bceedf] rounded-md shadow-sm focus:outline-none focus:ring-[#7eefb7] focus:border-[#7eefb7]"
                            />
                        </div>
                    </DialogDescription>
                    <div className="flex justify-end">
                        <span
                            onClick={handleSave}
                            className="px-4 py-2 rounded-md text-white bg-transparent border-2 border-[#b4eaef] hover:bg-[#fff] hover:text-[#000] transition-colors"
                        >
                            Сохранить
                        </span>
                    </div>
                    <div className="mt-4">
                        <div
                            onClick={() => onPasswordReset(userData?.email || '')}
                            className="cursor-pointer w-full px-4 py-2 border-1 border-[#bceedf] rounded-md shadow-sm focus:outline-none focus:ring-[#7eefb7] focus:border-[#7eefb7] mt-2 flex items-center justify-center"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onPasswordReset(userData?.email || '');
                                }
                            }}
                        >
                            Сбросить пароль
                        </div>
                        <div
                            onClick={onLogout}
                            className="cursor-pointer w-full px-4 py-2 border-1 border-[#bceedf] rounded-md shadow-sm focus:outline-none focus:ring-[#7eefb7] focus:border-[#7eefb7] text-[#ed3434] mt-2 flex items-center justify-center"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onLogout();
                                }
                            }}
                        >
                            Выйти
                        </div>

                        <div
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="cursor-pointer w-full px-4 py-2 border-1 border-[#bceedf] rounded-md shadow-sm focus:outline-none focus:ring-[#7eefb7] focus:border-[#7eefb7] text-[#f40b0b] mt-2 flex items-center justify-center"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setIsDeleteDialogOpen(true);
                                }
                            }}
                        >
                            Удалить профиль
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProfileHeader;
