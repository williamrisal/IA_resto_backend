/**
 * Base de données de démonstration en mémoire
 * Utilisée quand MongoDB n'est pas disponible
 */

let menuItems = [
    {
        _id: '1',
        name: 'Pizza Margherita',
        category: 'Pizza',
        description: 'Tomate, mozzarella, basilic',
        price: 12.50,
        available: true,
        preparationTime: 15,
    },
    {
        _id: '2',
        name: 'Pâtes Carbonara',
        category: 'Pâtes',
        description: 'Œuf, pancetta, parmesan',
        price: 14.00,
        available: true,
        preparationTime: 12,
    },
    {
        _id: '3',
        name: 'Salade César',
        category: 'Salade',
        description: 'Laitue, croûtons, parmesan',
        price: 9.50,
        available: true,
        preparationTime: 5,
    },
    {
        _id: '4',
        name: 'Steak Frites',
        category: 'Plats',
        description: 'Steak 200g, frites maison',
        price: 18.50,
        available: true,
        preparationTime: 20,
    },
    {
        _id: '5',
        name: 'Tiramisu',
        category: 'Dessert',
        description: 'Tiramisu traditionnel',
        price: 6.50,
        available: false,
        preparationTime: 5,
    },
]

let orders = [
    {
        _id: '1',
        orderId: 'CMD-001',
        type: 'Livraison',
        customer: { name: 'M. Dupont', phone: '0612345678', email: 'dupont@email.com' },
        address: { street: '123 Rue de Paris', city: 'Paris', zipCode: '75000' },
        items: [{ name: 'Pizza Margherita', quantity: 2, price: 12.50, subtotal: 25.00 }],
        total: 45.50,
        status: 'En cours',
        paymentStatus: 'Payé',
        createdAt: new Date(),
    },
    {
        _id: '2',
        orderId: 'CMD-002',
        type: 'À emporter',
        customer: { name: 'Mme Martin', phone: '0687654321', email: 'martin@email.com' },
        address: { street: 'N/A', city: 'N/A', zipCode: 'N/A' },
        items: [{ name: 'Pâtes Carbonara', quantity: 1, price: 14.00, subtotal: 14.00 }],
        total: 28.00,
        status: 'Prêt',
        paymentStatus: 'Payé',
        createdAt: new Date(),
    },
]

export const mockDB = {
    menuItems,
    orders,
}
