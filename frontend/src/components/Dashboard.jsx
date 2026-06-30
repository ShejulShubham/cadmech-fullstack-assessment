import React from 'react';

function Dashboard({ stats }) {
  // Array configuration to map statistics properties cleanly to cards
  const cardData = [
    {
      title: 'Total Equipment Assets',
      value: stats.total,
      icon: '🏭',
      cssClass: 'card-total'
    },
    {
      title: 'Active Operations',
      value: stats.active,
      icon: '🟢',
      cssClass: 'card-active'
    },
    {
      title: 'Under Maintenance',
      value: stats.underMaintenance,
      icon: '🟡',
      cssClass: 'card-maintenance'
    },
    {
      title: 'Decommissioned',
      value: stats.decommissioned,
      icon: '🔴',
      cssClass: 'card-decommissioned'
    }
  ];

  return (
    <div className="dashboard-wrapper">
      <h2 className="view-title">📊 Operational Overview</h2>
      
      <div className="stats-grid">
        {cardData.map((card, index) => (
          <div key={index} className={`stat-card ${card.cssClass}`}>
            <div className="card-header">
              <span className="card-icon" role="img" aria-label={card.title}>
                {card.icon}
              </span>
              <h3 className="card-title">{card.title}</h3>
            </div>
            <div className="card-body">
              <p className="card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-insights-banner">
        <h3>💡 Live System Insight</h3>
        <p>
          Currently, <strong>{((stats.active / (stats.total || 1)) * 100).toFixed(1)}%</strong> of your total lab inventory is operational. 
          {stats.underMaintenance > 0 && ` There are ${stats.underMaintenance} assets requiring attention from engineers.`}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;