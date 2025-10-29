import { useState, useEffect } from 'react'

export function useReservations() {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reservations')

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réservations')
      }

      const data = await response.json()
      setReservations(data.reservations || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const createReservation = async (reservationData: any) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création')
      }

      const data = await response.json()
      setReservations([data.reservation, ...reservations])
      return data.reservation
    } catch (err: any) {
      throw err
    }
  }

  const updateReservation = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      const data = await response.json()
      setReservations(reservations.map(r => r.id === id ? data.reservation : r))
      return data.reservation
    } catch (err: any) {
      throw err
    }
  }

  const deleteReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setReservations(reservations.filter(r => r.id !== id))
    } catch (err: any) {
      throw err
    }
  }

  return {
    reservations,
    loading,
    error,
    refreshReservations: fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tâches')
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const createTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création')
      }

      const data = await response.json()
      setTasks([...tasks, data.task])
      return data.task
    } catch (err: any) {
      throw err
    }
  }

  const updateTask = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      const data = await response.json()
      setTasks(tasks.map(t => t.id === id ? data.task : t))
      return data.task
    } catch (err: any) {
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setTasks(tasks.filter(t => t.id !== id))
    } catch (err: any) {
      throw err
    }
  }

  return {
    tasks,
    loading,
    error,
    refreshTasks: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/expenses')

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des dépenses')
      }

      const data = await response.json()
      setExpenses(data.expenses || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const createExpense = async (expenseData: any) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création')
      }

      const data = await response.json()
      setExpenses([data.expense, ...expenses])
      return data.expense
    } catch (err: any) {
      throw err
    }
  }

  return {
    expenses,
    loading,
    error,
    refreshExpenses: fetchExpenses,
    createExpense,
  }
}

export function useMobileHomes() {
  const [mobileHomes, setMobileHomes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMobileHomes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/mobile-homes')

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des mobile homes')
      }

      const data = await response.json()
      setMobileHomes(data.mobileHomes || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMobileHomes()
  }, [])

  const createMobileHome = async (mobileHomeData: any) => {
    try {
      const response = await fetch('/api/mobile-homes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mobileHomeData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création')
      }

      const data = await response.json()
      setMobileHomes([...mobileHomes, data.mobileHome])
      return data.mobileHome
    } catch (err: any) {
      throw err
    }
  }

  const updateMobileHome = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/mobile-homes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      const data = await response.json()
      setMobileHomes(mobileHomes.map(mh => mh.id === id ? data.mobileHome : mh))
      return data.mobileHome
    } catch (err: any) {
      throw err
    }
  }

  const deleteMobileHome = async (id: string) => {
    try {
      const response = await fetch(`/api/mobile-homes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setMobileHomes(mobileHomes.filter(mh => mh.id !== id))
    } catch (err: any) {
      throw err
    }
  }

  return {
    mobileHomes,
    loading,
    error,
    refreshMobileHomes: fetchMobileHomes,
    createMobileHome,
    updateMobileHome,
    deleteMobileHome,
  }
}

export function useTenants() {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTenants = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tenants')

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des locataires')
      }

      const data = await response.json()
      setTenants(data.tenants || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const createTenant = async (tenantData: any) => {
    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la création')
      }

      const data = await response.json()
      setTenants([data.tenant, ...tenants])
      return data.tenant
    } catch (err: any) {
      throw err
    }
  }

  const updateTenant = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/tenants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      const data = await response.json()
      setTenants(tenants.map(t => t.id === id ? data.tenant : t))
      return data.tenant
    } catch (err: any) {
      throw err
    }
  }

  const deleteTenant = async (id: string) => {
    try {
      const response = await fetch(`/api/tenants/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      setTenants(tenants.filter(t => t.id !== id))
    } catch (err: any) {
      throw err
    }
  }

  return {
    tenants,
    loading,
    error,
    refreshTenants: fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
  }
}

export function useInventory(mobileHomeId: string | null) {
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = async () => {
    if (!mobileHomeId) {
      setInventoryItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/inventory?mobileHomeId=${mobileHomeId}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'inventaire')
      }

      const data = await response.json()
      setInventoryItems(data.inventoryItems || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [mobileHomeId])

  const createInventoryItem = async (itemData: any) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création')
      }

      const data = await response.json()
      setInventoryItems([...inventoryItems, data.inventoryItem])
      return data.inventoryItem
    } catch (err: any) {
      throw err
    }
  }

  const updateInventoryItem = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      const data = await response.json()
      setInventoryItems(inventoryItems.map(item => item.id === id ? data.inventoryItem : item))
      return data.inventoryItem
    } catch (err: any) {
      throw err
    }
  }

  const deleteInventoryItem = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      setInventoryItems(inventoryItems.filter(item => item.id !== id))
    } catch (err: any) {
      throw err
    }
  }

  return {
    inventoryItems,
    loading,
    error,
    refreshInventory: fetchInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  }
}

export function useInventoryChecks(mobileHomeId?: string, reservationId?: string) {
  const [inventoryChecks, setInventoryChecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInventoryChecks = async () => {
    if (!mobileHomeId && !reservationId) {
      setInventoryChecks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (mobileHomeId) params.append('mobileHomeId', mobileHomeId)
      if (reservationId) params.append('reservationId', reservationId)

      const response = await fetch(`/api/inventory-checks?${params}`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des états des lieux')
      }

      const data = await response.json()
      setInventoryChecks(data.inventoryChecks || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryChecks()
  }, [mobileHomeId, reservationId])

  const createInventoryCheck = async (checkData: any) => {
    try {
      const response = await fetch('/api/inventory-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la création')
      }

      const data = await response.json()
      setInventoryChecks([data.inventoryCheck, ...inventoryChecks])
      return data.inventoryCheck
    } catch (err: any) {
      throw err
    }
  }

  const updateInventoryCheck = async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/inventory-checks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      const data = await response.json()
      setInventoryChecks(inventoryChecks.map(check => check.id === id ? data.inventoryCheck : check))
      return data.inventoryCheck
    } catch (err: any) {
      throw err
    }
  }

  const deleteInventoryCheck = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory-checks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setInventoryChecks(inventoryChecks.filter(check => check.id !== id))
    } catch (err: any) {
      throw err
    }
  }

  return {
    inventoryChecks,
    loading,
    error,
    refreshInventoryChecks: fetchInventoryChecks,
    createInventoryCheck,
    updateInventoryCheck,
    deleteInventoryCheck,
  }
}
