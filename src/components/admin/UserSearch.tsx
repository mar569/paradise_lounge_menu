import React from 'react';

import type { User } from './types';
import UserInfo from './UserInfo';

interface UserSearchProps {
    userIdInput: string;
    setUserIdInput: (value: string) => void;
    onFindUser: () => void;
    foundUser: User | null;
}

const UserSearch: React.FC<UserSearchProps> = React.memo(({ userIdInput, setUserIdInput, onFindUser, foundUser }) => {
    return (
        <div className="bg-transparent border-1 border-[#394d3e] p-4 rounded-lg">
            <h4 className="text-xl font-semibold text-white mb-4">Поиск пользователя</h4>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Введите ID пользователя"
                    className="flex-1 p-2 bg-transparent border-1 border-[#3cb755] text-[#fff] rounded hover:bg-[#14502a] transition duration-300 ease-in-out cursor-pointer uppercase"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                />
                <button
                    onClick={onFindUser}
                    className="px-4 py-2 bg-transparent border-1 border-[#3cb755] text-[#fff] rounded hover:bg-[#14502a] transition duration-300 ease-in-out cursor-pointer"
                >
                    Найти
                </button>
            </div>
            <UserInfo user={foundUser} />
        </div>
    );
});

export default UserSearch;
