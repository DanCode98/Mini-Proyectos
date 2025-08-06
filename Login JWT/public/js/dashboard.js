document.addEventListener('DOMContentLoaded', async () => {
    const userNameElement = document.getElementById('user-name');
    const lastAccessElement = document.getElementById('last-access');
    const logoutBtn = document.getElementById('logout-btn');

    // Verificar autenticación al cargar el dashboard
    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, redirigir al login
        window.location.href = 'index.html';
        return;
    }

    try {
        // Obtener información del usuario
        const response = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Mostrar información del usuario
            userNameElement.textContent = data.user.username;

            // Mostrar última fecha de acceso
            const now = new Date();
            lastAccessElement.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        } else {
            // Si el token no es válido, redirigir al login
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error:', error);
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }

    // Manejar logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});