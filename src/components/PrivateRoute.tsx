import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../services/firebase';

interface PrivateRouteProps {
    element: JSX.Element;
    adminOnly?: boolean; // Проп для проверки, является ли пользователь администратором
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, adminOnly }) => {
    const user = auth.currentUser; // Получаем текущего пользователя

    // Проверяем, является ли пользователь администратором
    const isAdmin = user && user.email === 'efiminkirill01@mail.ru';

    // Если пользователь не авторизован или не является администратором, перенаправляем на страницу "not-auth"
    if (!user || (adminOnly && !isAdmin)) {
        return <Navigate to="/not-auth" />;
    }

    // Если все проверки пройдены, возвращаем элемент
    return element;
};

export default PrivateRoute;
