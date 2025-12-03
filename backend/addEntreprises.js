/**
 * Script pour ajouter 2 autres entreprises via l'API
 * Lance le serveur avant d'exécuter ce script !
 */

const multipleEntreprises = {
    entreprises: [
        {
            name: "Pâtes Italienne",
            email: "pates.italienne@resto.fr",
            password: "password123",
            phone: "01 11 22 33 44",
            address: "789 Rue Italia",
            city: "Marseille",
            postalCode: "13000",
            menus: [
                {
                    name: "Spaghetti Carbonara",
                    category: "Pâtes",
                    description: "Pâtes avec lardons et œufs",
                    price: 13.00,
                    available: true,
                    preparationTime: 12
                },
                {
                    name: "Lasagne",
                    category: "Plats",
                    description: "Lasagne bolognaise",
                    price: 14.50,
                    available: true,
                    preparationTime: 15
                },
                {
                    name: "Tiramisu",
                    category: "Dessert",
                    description: "Dessert italien classique",
                    price: 6.50,
                    available: true,
                    preparationTime: 1
                }
            ],
            clients: [
                {
                    orderNumber: "3001",
                    phoneNumber: "06 33 44 55 66",
                    name: "Luc Rousseau",
                    address: "999 Rue Sud",
                    city: "Marseille",
                    postalCode: "13000",
                    status: "Actif",
                    orderCount: 8,
                    totalSpent: 210.50
                },
                {
                    orderNumber: "3002",
                    phoneNumber: "06 44 55 66 77",
                    name: "Emma Rossi",
                    address: "111 Via Roma",
                    city: "Marseille",
                    postalCode: "13001",
                    status: "Actif",
                    orderCount: 12,
                    totalSpent: 340.75
                }
            ]
        },
        {
            name: "Kebab Palace",
            email: "kebab.palace@resto.fr",
            password: "password123",
            phone: "01 22 33 44 55",
            address: "555 Rue Kebab",
            city: "Toulouse",
            postalCode: "31000",
            menus: [
                {
                    name: "Kebab Poulet",
                    category: "Plats",
                    description: "Poulet marinée avec sauce",
                    price: 9.50,
                    available: true,
                    preparationTime: 10
                },
                {
                    name: "Kebab Viande",
                    category: "Plats",
                    description: "Viande hachée avec sauce",
                    price: 10.50,
                    available: true,
                    preparationTime: 10
                },
                {
                    name: "Frites",
                    category: "Plats",
                    description: "Frites croustillantes",
                    price: 4.50,
                    available: true,
                    preparationTime: 5
                },
                {
                    name: "Soda",
                    category: "Boissons",
                    description: "Soda frais",
                    price: 2.50,
                    available: true,
                    preparationTime: 1
                }
            ],
            clients: [
                {
                    orderNumber: "4001",
                    phoneNumber: "06 55 66 77 88",
                    name: "Ahmed Ben Ali",
                    address: "222 Boulevard Est",
                    city: "Toulouse",
                    postalCode: "31000",
                    status: "Actif",
                    orderCount: 20,
                    totalSpent: 450.00
                },
                {
                    orderNumber: "4002",
                    phoneNumber: "06 66 77 88 99",
                    name: "Fatima Saïdi",
                    address: "333 Rue Nord",
                    city: "Toulouse",
                    postalCode: "31001",
                    status: "Actif",
                    orderCount: 15,
                    totalSpent: 320.30
                },
                {
                    orderNumber: "4003",
                    phoneNumber: "06 77 88 99 00",
                    name: "Karim Malik",
                    address: "444 Avenue Ouest",
                    city: "Toulouse",
                    postalCode: "31002",
                    status: "Actif",
                    orderCount: 10,
                    totalSpent: 215.00
                }
            ]
        }
    ]
}

async function addEntreprises() {
    try {
        console.log('📡 Envoi des 2 nouvelles entreprises à l\'API...\n')

        const response = await fetch('http://localhost:5000/api/seed/multiple', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(multipleEntreprises),
        })

        const result = await response.json()

        if (result.success) {
            console.log('✅ ' + result.message + '\n')

            result.data.forEach((item, index) => {
                console.log(`${index + 1}. ${item.entreprise.name}`)
                console.log(`   📍 ${item.entreprise.address}, ${item.entreprise.postalCode} ${item.entreprise.city}`)
                console.log(`   🍕 Menus: ${item.menus}`)
                console.log(`   👥 Clients: ${item.clients}\n`)
            })

            console.log('='.repeat(60))
            console.log('✅ Les 3 entreprises sont maintenant dans MongoDB')
            console.log('📍 Regarde dans MongoDB Compass pour vérifier !')
            console.log('='.repeat(60) + '\n')
        } else {
            console.error('❌ Erreur:', result.message)
            console.error(result.error)
        }
    } catch (error) {
        console.error('❌ Erreur de connexion:', error.message)
        console.log('\n⚠️  Assurez-vous que le serveur est lancé sur http://localhost:5000')
        console.log('Commande: npm run dev')
    }
}

addEntreprises()
