
import React from 'react';
import type { UserData } from './types';
import logo from '../../../assets/paradiseLogo.jpg';
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from '../../lightswind/dialog';

interface ProfileDetailsProps {
    userData: UserData | null;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userData }) => {
    return (
        <div className="flex items-center space-x-4">
            <div
                className="flex items-center justify-center w-20 h-20 rounded-full overflow-hidden"
                style={{
                    background: 'radial-gradient(circle at 35.86% 50%, #3cb755 0%, #05885f 48.96%, #3D0162 100%)',
                    padding: '2px'
                }}
            >
                <div className="w-full h-full rounded-full ">
                    <img
                        src={logo}
                        alt="Логотип"
                        className="w-19 h-19 object-cover rounded-full"
                    />
                </div>
            </div>

            <div className="flex-1">
                <h2 className="text-xl text-[#fff] font-semibold"
                    style={{ fontFamily: 'Sofia', fontWeight: 'bold' }}>{userData?.name}</h2>
                <p className="text-gray-500 mt-1">{userData?.email}</p>
                <Dialog>
                    <DialogTrigger>
                        <p className="text-gray-500 cursor-pointer ">ID: {userData?.userId}</p>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogDescription>
                            <p className="text-gray-100 pl-2 text-[2.5rem] leading-relaxed tracking-widest">{userData?.userId}</p>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ProfileDetails;
