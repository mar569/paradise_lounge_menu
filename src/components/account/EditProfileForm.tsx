import React, { useState } from "react";

const EditProfileForm: React.FC<{ currentName: string; onEditProfile: (newName: string) => void; onClose: () => void; }> = ({ currentName, onEditProfile, onClose }) => {
    const [newName, setNewName] = useState<string>(currentName);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!newName.trim()) {
            setError('Имя не может быть пустым.');
            return;
        }

        setLoading(true);
        try {
            await onEditProfile(newName); // Предполагается, что onEditProfile возвращает промис
            onClose(); // Закрываем форму после успешного обновления
        } catch (err) {
            setError('Ошибка при обновлении имени: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col mt-4">
            <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="border p-2 mb-4 w-full"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
                type="submit"
                className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button type="button" onClick={onClose} className="mt-2 text-red-500">Отмена</button>
        </form>
    );
};

export default EditProfileForm;
