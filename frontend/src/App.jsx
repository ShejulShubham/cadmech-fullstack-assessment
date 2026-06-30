import { useState, useEffect } from 'react'
import { apiService } from './services/api'
import './App.css'

// Placeholder components we will create in the next step
// import Dashboard from './components/Dashboard'
// import EquipmentList from './components/EquipmentList'
// import EquipmentForm from './components/EquipmentForm'

function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' | 'list' | 'add' | 'edit'
  const [editingItemId, setEditingItemId] = useState(null)

  // Core Application Data States
  const [stats, setStats] = useState({ total: 0, active: 0, underMaintenance: 0, decommissioned: 0 })
  const [equipment, setEquipment] = useState([])
  
  // UX Lifecycle Management States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Real-time Search & Filter States
  const [filters, setFilters] = useState({ search: '', type: '', status: '' })

  // Centralized Data Fetcher Loop
  const fetchAllData = async (activeFilters = filters) => {
    setLoading(true)
    setError(null)
    try {
      // Parallel network orchestration to prevent waterfall loading latencies
      const [statsRes, equipmentRes] = await Promise.all([
        apiService.getStats(),
        apiService.getEquipment(activeFilters)
      ])
      
      if (statsRes.status === 'success') setStats(statsRes.stats)
      if (equipmentRes.status === 'success') setEquipment(equipmentRes.data)
    } catch (err) {
      console.error('Data sync failure:', err)
      setError('Could not establish synchronization with the server. Please check connection status.')
    } finally {
      setLoading(false)
    }
  }

  // Hook into initial render and filter configuration adjustments
  useEffect(() => {
    fetchAllData()
  }, [filters.type, filters.status]) // Immediate reload on select dropdown changes

  // Trigger search with manual execution button or on input updates
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    fetchAllData()
  }

  // Deletion Confirmation Pipeline
  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete "${name}" from the system inventory?`)) {
      try {
        setLoading(true)
        await apiService.deleteEquipment(id)
        await fetchAllData() // Refresh records seamlessly
        if (currentView === 'edit' && editingItemId === id) {
          setCurrentView('dashboard')
        }
      } catch (err) {
        setError(err.message || 'Failed to successfully drop target asset profile.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏭 SmartLab Equipment Manager</h1>
          <p className="subtitle">Cadmech Engineering Pvt. Ltd.</p>
        </div>
        <nav className="header-nav">
          <button 
            className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-link ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            📋 Equipment Inventory
          </button>
          <button 
            className="nav-btn-add"
            onClick={() => { setEditingItemId(null); setCurrentView('add') }}
          >
            ➕ Add Equipment
          </button>
        </nav>
      </header>

      <main className="app-main">
        {/* Centralized Global Loading State Indicator (Addresses Render Sleep Cycles) */}
        {loading && (
          <div className="global-loader">
            <div className="spinner"></div>
            <p>Synchronizing assets... (Waking up server if needed, please wait)</p>
          </div>
        )}

        {/* Global Operational Error Feedback Strip */}
        {error && (
          <div className="global-error-banner">
            <span>⚠️ {error}</span>
            <button className="error-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* State-Driven Dynamic View Controller Viewport */}
        <div className="view-container">
          {currentView === 'dashboard' && (
            <div>
              {/* <Dashboard stats={stats} /> */}
              <p style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>Dashboard view mapped successfully.</p>
            </div>
          )}

          {currentView === 'list' && (
            <div>
              {/* <EquipmentList 
                    items={equipment} 
                    filters={filters} 
                    setFilters={setFilters} 
                    onSearchSubmit={handleSearchSubmit}
                    onEditClick={(id) => { setEditingItemId(id); setCurrentView('edit'); }}
                    onDeleteClick={handleDeleteItem} 
                  /> */}
              <p style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>Inventory list matrix mapped successfully.</p>
            </div>
          )}

          {(currentView === 'add' || currentView === 'edit') && (
            <div>
              {/* <EquipmentForm 
                    itemId={editingItemId} 
                    onSuccess={() => { setCurrentView('list'); fetchAllData(); }} 
                    onCancel={() => setCurrentView('list')} 
                  /> */}
              <p style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>Asset modification panel mapped successfully.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          CADMech Full Stack Assessment &copy; {new Date().getFullYear()} —
          Cadmech Engineering Pvt. Ltd.
        </p>
      </footer>
    </div>
  )
}

export default App