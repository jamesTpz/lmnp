import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    textDecoration: 'underline',
  },
  text: {
    marginBottom: 5,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e0e0e0',
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '40%',
  },
  signatureLine: {
    marginTop: 40,
    borderTop: '1px solid #000',
    paddingTop: 5,
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#666',
  },
})

interface RentalContractProps {
  reservation: {
    id: string
    checkInDate: Date
    checkOutDate: Date
    numberOfGuests: number
    totalPrice: number
    depositAmount: number
  }
  tenant: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address?: string
  }
  mobileHome: {
    name: string
    location: string
    capacity: number
    bedrooms: number
    bathrooms: number
  }
  owner: {
    firstName?: string
    lastName?: string
    email: string
  }
}

export function RentalContract({ reservation, tenant, mobileHome, owner }: RentalContractProps) {
  const checkInDate = new Date(reservation.checkInDate).toLocaleDateString('fr-FR')
  const checkOutDate = new Date(reservation.checkOutDate).toLocaleDateString('fr-FR')
  const contractDate = new Date().toLocaleDateString('fr-FR')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>CONTRAT DE LOCATION SAISONNIÈRE</Text>
          <Text style={styles.text}>Mobile Home Meublé</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ENTRE LES SOUSSIGNÉS :</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Le Propriétaire :</Text> {owner.firstName || ''} {owner.lastName || ''}
          </Text>
          <Text style={styles.text}>Email : {owner.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Le Locataire :</Text> {tenant.firstName} {tenant.lastName}
          </Text>
          <Text style={styles.text}>Email : {tenant.email}</Text>
          <Text style={styles.text}>Téléphone : {tenant.phone}</Text>
          {tenant.address && <Text style={styles.text}>Adresse : {tenant.address}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBJET DU CONTRAT :</Text>
          <Text style={styles.text}>
            Le propriétaire loue au locataire le mobile home suivant :
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Dénomination :</Text> {mobileHome.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Localisation :</Text> {mobileHome.location}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Capacité :</Text> {mobileHome.capacity} personnes
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Composition :</Text> {mobileHome.bedrooms} chambre(s), {mobileHome.bathrooms} salle(s) de bain
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DURÉE DE LA LOCATION :</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Date d'arrivée :</Text> {checkInDate}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Date de départ :</Text> {checkOutDate}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Nombre de voyageurs :</Text> {reservation.numberOfGuests} personne(s)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONDITIONS FINANCIÈRES :</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Description</Text>
              <Text style={styles.tableCell}>Montant</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Prix total du séjour</Text>
              <Text style={styles.tableCell}>{reservation.totalPrice.toFixed(2)} €</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Dépôt de garantie</Text>
              <Text style={styles.tableCell}>{reservation.depositAmount.toFixed(2)} €</Text>
            </View>
          </View>
          <Text style={styles.text}>
            Le dépôt de garantie sera restitué dans un délai de 15 jours suivant le départ, après déduction des éventuels dommages constatés.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBLIGATIONS DU LOCATAIRE :</Text>
          <Text style={styles.text}>• Occuper les lieux en bon père de famille</Text>
          <Text style={styles.text}>• Respecter le règlement intérieur du camping</Text>
          <Text style={styles.text}>• Maintenir les lieux dans l'état où ils ont été remis</Text>
          <Text style={styles.text}>• Signaler immédiatement toute dégradation ou dysfonctionnement</Text>
          <Text style={styles.text}>• Respecter le nombre maximum d'occupants autorisés</Text>
          <Text style={styles.text}>• Restituer les lieux en bon état de propreté</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ASSURANCE :</Text>
          <Text style={styles.text}>
            Le locataire déclare être assuré pour les risques locatifs et s'engage à fournir une attestation d'assurance sur demande.
          </Text>
        </View>

        <View style={styles.signature}>
          <View style={styles.signatureBlock}>
            <Text style={styles.text}>Fait à ____________</Text>
            <Text style={styles.text}>Le {contractDate}</Text>
            <View style={styles.signatureLine}>
              <Text>Signature du Propriétaire</Text>
            </View>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.text}>Fait à ____________</Text>
            <Text style={styles.text}>Le {contractDate}</Text>
            <View style={styles.signatureLine}>
              <Text>Signature du Locataire</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Contrat généré par LMNP-Serenity - Référence : {reservation.id}
        </Text>
      </Page>
    </Document>
  )
}
