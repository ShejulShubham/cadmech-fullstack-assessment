import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const VALID_TYPES = ['CNC Machine', 'IoT Sensor', 'Automation Trainer', 'PLC Module', 'Hydraulic System', 'Pneumatic System', 'Electrical Panel'];
const VALID_STATUSES = ['Active', 'Under Maintenance', 'Decommissioned'];

function EquipmentForm({ itemId, onSuccess, onCancel }) {
  const isEditMode = Boolean(itemId);
// TODO: Gracefully show error for duplicate serial number  
  // Isolated Local Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'Active',
    location: '',
    serial_number: '',
    description: '',
    installed_date: ''
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Hook to pull existing asset context if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchAssetDetails = async () => {
        setLoading(true);
        setFormError(null);
        try {
          const response = await apiService.getEquipmentById(itemId);
          if (response.status === 'success' && response.data) {
            const asset = response.data;
            // Format dates properly to map onto traditional HTML5 calendar inputs
            const formattedDate = asset.installed_date 
              ? new Date(asset.installed_date).toISOString().split('T')[0] 
              : '';

            setFormData({
              name: asset.name || '',
              type: asset.type || '',
              status: asset.status || 'Active',
              location: asset.location || '',
              serial_number: asset.serial_number || '',
              description: asset.description || '',
              installed_date: formattedDate
            });
          }
        } catch (err) {
          console.error('Failed to resolve asset data profile:', err);
          setFormError('Could not populate target asset profiles from the remote cluster.');
        } finally {
          setLoading(false);
        }
      };
      fetchAssetDetails();
    }
  }, [itemId, isEditMode]);

  // Handle generalized input value tracking
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form Processing Submission Pipeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    // Baseline validation check
    if (!formData.name.trim() || !formData.type || !formData.status || !formData.serial_number.trim()) {
      setFormError('Please complete all required fields (*).');
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await apiService.updateEquipment(itemId, formData);
      } else {
        await apiService.createEquipment(formData);
      }
      onSuccess(); // Route back to inventory main desk on success
    } catch (err) {
      console.error('Form transaction exception:', err);
      setFormError(err.message || 'Operation failed. Verify parameters match system rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card-wrapper">
      <div className="form-card-header">
        <h2 className="view-title">{isEditMode ? '✏️ Modify Asset Profile' : '➕ Register Laboratory Equipment'}</h2>
        <p className="form-subtitle">Ensure serial parameters align with physical equipment records.</p>
      </div>

      {formError && <div className="form-error-strip">⚠️ {formError}</div>}
      {loading && !formData.name && <div className="form-inline-loader">Loading profile fields...</div>}

      <form onSubmit={handleSubmit} className="equipment-core-form">
        <div className="form-grid-layout">
          
          {/* Section: Asset Core Identity info */}
          <div className="form-field-group">
            <label className="form-field-label">Equipment Asset Name <span className="req">*</span></label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., 3-Axis CNC Router Bench"
              className="form-input"
              required
            />
          </div>

          <div className="form-field-group">
            <label className="form-field-label">Unique Serial Number <span className="req">*</span></label>
            <input 
              type="text" 
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="e.g., CNC-2026-X89"
              className="form-input"
              required
            />
          </div>

          {/* Section: Classifications metadata choices */}
          <div className="form-field-group">
            <label className="form-field-label">Equipment Classification <span className="req">*</span></label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select-field"
              required
            >
              <option value="" disabled>Select Core Category</option>
              {VALID_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="form-field-group">
            <label className="form-field-label">Operational Status Flag <span className="req">*</span></label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select-field"
              required
            >
              {VALID_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          {/* Section: Physical Logistics records */}
          <div className="form-field-group">
            <label className="form-field-label">Physical Laboratory Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Room 402, Automation Wing"
              className="form-input"
            />
          </div>

          <div className="form-field-group">
            <label className="form-field-label">Installation Commission Date</label>
            <input 
              type="date" 
              name="installed_date"
              value={formData.installed_date}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Full-width block text descriptors */}
        <div className="form-field-group full-width-field">
          <label className="form-field-label">Technical Specification Details / Notes</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Document operational restrictions, connected interfaces, or vendor support details..."
            className="form-textarea"
            rows="4"
          />
        </div>

        {/* Command Form Navigation Trigger Bar */}
        <div className="form-action-footer-bar">
          <button 
            type="button" 
            className="btn-form-cancel" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-form-submit" 
            disabled={loading}
          >
            {loading ? 'Processing Transaction...' : isEditMode ? 'Save System Configuration' : 'Commit Asset to Inventory'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EquipmentForm;