import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  text: {
    marginBottom: 4,
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: 'bold',
  },
  table: {
    marginTop: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #d0d0d0',
    minHeight: 25,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#e8e8e8',
    fontWeight: 'bold',
    borderBottom: '2px solid #999',
  },
  tableCell: {
    padding: 4,
    fontSize: 9,
  },
  itemName: {
    width: '30%',
  },
  quantity: {
    width: '15%',
    textAlign: 'center',
  },
  condition: {
    width: '20%',
  },
  notes: {
    width: '35%',
  },
  signature: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '45%',
    padding: 10,
    border: '1px solid #ccc',
  },
  signatureLine: {
    marginTop: 50,
    borderTop: '1px solid #000',
    paddingTop: 5,
    fontSize: 9,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
  checkType: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: 5,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
})

interface InventoryItem {
  name: string
  category: string
  quantity: number
  condition?: string
}

interface InventoryFormProps {
  mobileHome: {
    name: string
    location: string
  }
  reservation: {
    id: string
    checkInDate: Date
    checkOutDate: Date
  }
  tenant: {
    firstName: string
    lastName: string
  }
  items: InventoryItem[]
  checkType: 'CHECK_IN' | 'CHECK_OUT'
}

export function InventoryForm({ mobileHome, reservation, tenant, items, checkType }: InventoryFormProps) {
  const date = checkType === 'CHECK_IN'
    ? new Date(reservation.checkInDate).toLocaleDateString('fr-FR')
    : new Date(reservation.checkOutDate).toLocaleDateString('fr-FR')

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, InventoryItem[]>)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>ÉTAT DES LIEUX {checkType === 'CHECK_IN' ? 'D\'ENTRÉE' : 'DE SORTIE'}</Text>
        </View>

        <View style={styles.checkType}>
          <Text>{checkType === 'CHECK_IN' ? '📝 ÉTAT DES LIEUX D\'ENTRÉE' : '✓ ÉTAT DES LIEUX DE SORTIE'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Mobile Home :</Text> {mobileHome.name}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Localisation :</Text> {mobileHome.location}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Date :</Text> {date}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Locataire :</Text> {tenant.firstName} {tenant.lastName}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Référence réservation :</Text> {reservation.id.slice(0, 8)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INVENTAIRE DES ÉQUIPEMENTS</Text>

          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <View key={category} style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5, marginTop: 5 }}>
                {category}
              </Text>

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, styles.itemName]}>Article</Text>
                  <Text style={[styles.tableCell, styles.quantity]}>Quantité</Text>
                  <Text style={[styles.tableCell, styles.condition]}>État</Text>
                  <Text style={[styles.tableCell, styles.notes]}>Observations</Text>
                </View>

                {categoryItems.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.itemName]}>{item.name}</Text>
                    <Text style={[styles.tableCell, styles.quantity]}>{item.quantity}</Text>
                    <Text style={[styles.tableCell, styles.condition]}>{item.condition || '_________'}</Text>
                    <Text style={[styles.tableCell, styles.notes]}>_______________</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBSERVATIONS GÉNÉRALES</Text>
          <View style={{ border: '1px solid #ccc', padding: 10, minHeight: 60 }}>
            <Text style={styles.text}>_____________________________________________</Text>
            <Text style={styles.text}>_____________________________________________</Text>
            <Text style={styles.text}>_____________________________________________</Text>
          </View>
        </View>

        <View style={styles.signature}>
          <View style={styles.signatureBlock}>
            <Text style={[styles.text, styles.bold]}>Propriétaire / Représentant</Text>
            <Text style={styles.text}>Nom : ______________________</Text>
            <View style={styles.signatureLine}>
              <Text>Signature</Text>
            </View>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={[styles.text, styles.bold]}>Locataire</Text>
            <Text style={styles.text}>Nom : {tenant.firstName} {tenant.lastName}</Text>
            <View style={styles.signatureLine}>
              <Text>Signature</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Document généré par LMNP-Serenity le {new Date().toLocaleDateString('fr-FR')}
        </Text>
      </Page>
    </Document>
  )
}
