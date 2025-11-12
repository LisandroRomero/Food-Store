import { getCurrentCart } from './cart';

// Función para actualizar el contador del carrito
const updateCartCount = () => {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = getCurrentCart();
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems.toString();
    }
};

// Función para cargar la barra de navegación
export const loadNavbar = async () => {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    try {
        const response = await fetch('/src/navbar.html'/navbar.html');
        const html = await response.text();
        navbarContainer.innerHTML = html;
        
        // Actualizar el contador del carrito después de cargar el navbar
        updateCartCount();
        
        // Escuchar cambios en el carrito para actualizar el contador
        window.addEventListener('cart-updated', () => {
            updateCartCount();
        });
    } catch (error) {
        console.error('Error al cargar el navbar:', error);
    }
};
