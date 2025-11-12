-- ============================================
-- EJEMPLOS DE DATOS PARA PEDIDOS (SQL)
-- ============================================
-- Este archivo contiene ejemplos de INSERT para probar el módulo de pedidos
-- Incluye: Categorías, Productos, Usuarios y Pedidos completos

-- NOTA: La fecha está en formato DATE en la BD, pero el backend la devuelve como [año, mes, día]

-- ============================================
-- 1. CATEGORÍAS
-- ============================================
INSERT INTO categorias (id, nombre, descripcion, imagen, activo, created_at) 
VALUES 
(1, 'Pizzas', 'Deliciosas pizzas artesanales con ingredientes frescos', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', true, NOW()),
(2, 'Hamburguesas', 'Hamburguesas gourmet con carne premium', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', true, NOW()),
(3, 'Acompañamientos', 'Papas fritas, aros de cebolla y más', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', true, NOW()),
(4, 'Bebidas', 'Bebidas gaseosas, jugos y refrescos', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', true, NOW());

-- ============================================
-- 2. PRODUCTOS
-- ============================================
INSERT INTO productos (id, nombre, descripcion, precio, stock, disponible, imagen, categoria_id, activo, created_at) 
VALUES 
(1, 'Pizza Margarita', 'Pizza clásica con tomate, mozzarella fresca y albahaca', 7500.00, 50, true, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 1, true, NOW()),
(2, 'Hamburguesa Clásica', 'Hamburguesa con carne 200g, lechuga, tomate, queso cheddar y salsa especial', 10500.00, 30, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 2, true, NOW()),
(3, 'Papas Fritas', 'Porción grande de papas fritas crujientes con sal', 6000.00, 100, true, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 3, true, NOW()),
(4, 'Bebida Gaseosa 500ml', 'Bebida gaseosa refrescante de 500ml', 12000.00, 200, true, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', 4, true, NOW()),
(5, 'Pizza Pepperoni', 'Pizza con pepperoni, queso mozzarella y orégano', 8500.00, 40, true, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 1, true, NOW()),
(6, 'Hamburguesa Doble', 'Hamburguesa doble con dos carnes, queso, lechuga y tomate', 13500.00, 25, true, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', 2, true, NOW());

-- ============================================
-- 3. USUARIOS (CLIENTES)
-- ============================================
-- NOTA: Ajusta la estructura según tu tabla de usuarios
-- Estos usuarios tienen rol CLIENTE para poder hacer pedidos
INSERT INTO usuarios (id, nombre, apellido, email, password, rol, activo, created_at) 
VALUES 
(1, 'Juan', 'Pérez', 'juan.perez@example.com', '$2a$10$ejemplo_hash_password', 'CLIENTE', true, NOW()),
(2, 'María', 'González', 'maria.gonzalez@example.com', '$2a$10$ejemplo_hash_password', 'CLIENTE', true, NOW()),
(3, 'Carlos', 'Rodríguez', 'carlos.rodriguez@example.com', '$2a$10$ejemplo_hash_password', 'CLIENTE', true, NOW());

-- NOTA: Si tu tabla de usuarios tiene campos diferentes, ajusta los nombres de columnas
-- Ejemplo si usas: user_name, user_lastname, user_email, etc.

-- ============================================
-- 4. PEDIDOS
-- ============================================
-- EJEMPLO 1: Pedido PENDIENTE
-- ============================================
INSERT INTO pedidos (id, usuario_id, fecha, estado, total, created_at) 
VALUES 
(1, 1, '2025-01-15', 'PENDIENTE', 25500.00, NOW());

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, subtotal) 
VALUES 
(1, 1, 1, 2, 15000.00),
(2, 1, 2, 1, 10500.00);

-- ============================================
-- EJEMPLO 2: Pedido EN CAMINO
-- ============================================
INSERT INTO pedidos (id, usuario_id, fecha, estado, total, created_at) 
VALUES 
(2, 2, '2025-01-16', 'EN CAMINO', 18000.00, NOW());

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, subtotal) 
VALUES 
(3, 2, 3, 3, 18000.00);

-- ============================================
-- EJEMPLO 3: Pedido COMPLETADO
-- ============================================
INSERT INTO pedidos (id, usuario_id, fecha, estado, total, created_at) 
VALUES 
(3, 1, '2025-01-14', 'COMPLETADO', 32000.00, NOW());

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, subtotal) 
VALUES 
(4, 3, 1, 1, 15000.00),
(5, 3, 2, 2, 21000.00);

-- ============================================
-- EJEMPLO 4: Pedido CANCELADO
-- ============================================
INSERT INTO pedidos (id, usuario_id, fecha, estado, total, created_at) 
VALUES 
(4, 3, '2025-01-13', 'CANCELADO', 12000.00, NOW());

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, subtotal) 
VALUES 
(6, 4, 4, 1, 12000.00);

-- ============================================
-- EJEMPLO 5: Pedido PENDIENTE con múltiples productos
-- ============================================
INSERT INTO pedidos (id, usuario_id, fecha, estado, total, created_at) 
VALUES 
(5, 2, '2025-01-17', 'PENDIENTE', 45000.00, NOW());

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, subtotal) 
VALUES 
(7, 5, 1, 2, 30000.00),
(8, 5, 2, 1, 10500.00),
(9, 5, 3, 1, 6000.00);

-- ============================================
-- EJEMPLO 6: Pedido EN CAMINO reciente
-- ============================================
INSERT INTO pedidos (id, usuario_id, fecha, estado, total, created_at) 
VALUES 
(6, 1, '2025-01-18', 'EN CAMINO', 28000.00, NOW());

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, subtotal) 
VALUES 
(10, 6, 2, 2, 21000.00),
(11, 6, 3, 1, 6000.00);

-- ============================================
-- EJEMPLO 7: Pedido PENDIENTE grande
-- ============================================
INSERT INTO pedidos (id, usuario_id, fecha, estado, total, created_at) 
VALUES 
(7, 3, '2025-01-19', 'PENDIENTE', 55000.00, NOW());

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, subtotal) 
VALUES 
(12, 7, 1, 3, 45000.00),
(13, 7, 2, 1, 10500.00);

-- ============================================
-- EJEMPLO 8: Pedido COMPLETADO antiguo
-- ============================================
INSERT INTO pedidos (id, usuario_id, fecha, estado, total, created_at) 
VALUES 
(8, 2, '2025-01-10', 'COMPLETADO', 15000.00, NOW());

INSERT INTO detalle_pedido (id, pedido_id, producto_id, cantidad, subtotal) 
VALUES 
(14, 8, 1, 1, 15000.00);

-- ============================================
-- QUERIES PARA VERIFICAR LOS DATOS INSERTADOS
-- ============================================

-- Verificar categorías
-- SELECT id, nombre, descripcion FROM categorias ORDER BY id;

-- Verificar productos
-- SELECT id, nombre, precio, stock, categoria_id FROM productos ORDER BY id;

-- Verificar usuarios
-- SELECT id, nombre, apellido, email, rol FROM usuarios WHERE rol = 'CLIENTE' ORDER BY id;

-- Verificar pedidos con información del cliente
-- SELECT 
--     p.id,
--     p.fecha,
--     p.estado,
--     p.total,
--     u.nombre || ' ' || u.apellido as cliente,
--     u.email,
--     COUNT(dp.id) as cantidad_productos
-- FROM pedidos p
-- JOIN usuarios u ON p.usuario_id = u.id
-- LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
-- GROUP BY p.id, p.fecha, p.estado, p.total, u.nombre, u.apellido, u.email
-- ORDER BY p.id;

-- Verificar detalles de un pedido específico
-- SELECT 
--     dp.id,
--     dp.pedido_id,
--     p.nombre as producto,
--     dp.cantidad,
--     dp.subtotal
-- FROM detalle_pedido dp
-- JOIN productos p ON dp.producto_id = p.id
-- WHERE dp.pedido_id = 1
-- ORDER BY dp.id;
