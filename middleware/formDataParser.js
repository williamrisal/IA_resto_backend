import multer from 'multer'

// Configuration de multer pour gérer form-data sans fichiers
const upload = multer()

/**
 * Middleware pour parser les données form-data et convertir les champs JSON
 * Utilise multer.none() pour accepter uniquement les champs de texte
 */
export const parseFormData = (req, res, next) => {
    // Vérifier si c'est du multipart/form-data
    const contentType = req.headers['content-type'] || ''
    
    if (contentType.includes('multipart/form-data')) {
        // Utiliser multer pour parser le form-data
        upload.none()(req, res, (err) => {
            if (err) {
                console.error('❌ Erreur multer:', err)
                return res.status(400).json({
                    success: false,
                    message: 'Erreur lors du parsing du form-data',
                    error: err.message,
                })
            }

            console.log('✅ Form-data parsé:', req.body)

            // Si c'est du form-data, convertir les champs JSON stringifiés
            if (req.body) {
                // Parser les champs qui sont des objets/arrays JSON stringifiés
                const fieldsToConvert = ['items', 'customer', 'address']
                
                fieldsToConvert.forEach(field => {
                    if (req.body[field] && typeof req.body[field] === 'string') {
                        try {
                            req.body[field] = JSON.parse(req.body[field])
                            console.log(`✅ ${field} parsé:`, req.body[field])
                        } catch (e) {
                            console.log(`⚠️ Impossible de parser ${field}:`, req.body[field])
                        }
                    }
                })

                // Convertir les nombres
                if (req.body.total) req.body.total = parseFloat(req.body.total)
            }

            next()
        })
    } else {
        // Si ce n'est pas du form-data, passer au middleware suivant
        console.log('📝 Content-Type:', contentType, '- Pas de form-data')
        next()
    }
}

export default parseFormData
