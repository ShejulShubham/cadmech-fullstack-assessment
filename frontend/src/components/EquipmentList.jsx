import React from 'react';

const VALID_TYPES = ['CNC Machine', 'IoT Sensor', 'Automation Trainer', 'PLC Module', 'Hydraulic System', 'Pneumatic System', 'Electrical Panel'];
const VALID_STATUSES = ['Active', 'Under Maintenance', 'Decommissioned'];

function EquipmentList({ items, filters, setFilters, onSearchSubmit, onEditClick, onDeleteClick }) {
  
  // Handle local filter change and propagate state upward
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper mapping to return semantic badge styles based on asset state
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'Under Maintenance': return 'badge-maintenance';
      case 'Decommissioned': return 'badge-decommissioned';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="equipment-list-wrapper">
      <div className="list-controls-header">
        <h2 className="view-title">📋 Equipment Inventory</h2>
      </div>
        {/* TODO: Fix the mobile view */}
      {/* Dynamic Search and Filter Toolbar Section */}
      <form className="filter-toolbar" onSubmit={onSearchSubmit}>
        <div className="search-box-group">
          <input 
            type="text" 
            placeholder="Search by name, serial, or specs..." 
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="form-input search-input"
          />
          <button type="submit" className="btn-search">🔍 Search</button>
        </div>

        <div className="dropdowns-group">
          <select 
            value={filters.type} 
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="form-select"
          >
            <option value="">All Equipment Types</option>
            {VALID_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="form-select"
          >
            <option value="">All Statuses</option>
            {VALID_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
          </select>

          {(filters.search || filters.type || filters.status) && (
            <button 
              type="button" 
              className="btn-clear"
              onClick={() => setFilters({ search: '', type: '', status: '' })}
            >
              Reset Filters
            </button>
          )}
        </div>
      </form>

      {/* Main Inventory View Window */}
      {items.length === 0 ? (
        <div className="empty-state-card">
          <p>No equipment profiles match your current search criteria.</p>
        </div>
      ) : (
        <div className="responsive-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Asset Name / Code</th>
                <th>Classification</th>
                <th>Current Status</th>
                <th>Installed Location</th>
                <th>Date Configured</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="inventory-row">
                  <td>
                    <div className="asset-primary-cell">
                      <span className="asset-name">{item.name}</span>
                      <span className="asset-serial">SN: {item.serial_number || 'N/A'}</span>
                    </div>
                  </td>
                  <td><span className="type-label">{item.type}</span></td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td><span className="location-text">{item.location || '—'}</span></td>
                  <td><span className="date-text">{item.installed_date ? new Date(item.installed_date).toLocaleDateString('en-IN') : '—'}</span></td>
                  <td>
                    <div className="action-buttons-group">
                      <button 
                        className="btn-action-edit" 
                        onClick={() => onEditClick(item.id)}
                        title="Edit Asset Configuration"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn-action-delete" 
                        onClick={() => onDeleteClick(item.id, item.name)}
                        title="Remove Asset Record"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EquipmentList;