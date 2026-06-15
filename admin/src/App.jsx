import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Ticket, Settings, Eye, EyeOff } from 'lucide-react';
import './index.css';

// Segment: Service Requests
function ServiceRequests() {
  const [bookings, setBookings] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterCentre, setFilterCentre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editType, setEditType] = useState('');

  const fetchBookings = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/bookings`)
      .then(res => res.json())
      .then(data => setBookings(data));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSaveEdit = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}`}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: editDate, serviceType: editType })
      });
      setEditingId(null);
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}`}/bookings/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bill: base64String, billName: file.name })
        });
        fetchBookings();
        alert('Bill uploaded successfully!');
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBill = async (id) => {
    if (!window.confirm("Are you sure you want to remove this uploaded bill?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}`}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bill: null, billName: null })
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteService = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}`}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchDate = filterDate ? b.date === filterDate : true;
    const matchCentre = filterCentre ? b.serviceCentre === filterCentre : true;

    let matchSearch = true;
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      matchSearch =
        (b.customerName && b.customerName.toLowerCase().includes(lowerQuery)) ||
        (b.customerPhone && b.customerPhone.includes(lowerQuery)) ||
        (b.refNumber && b.refNumber.toLowerCase().includes(lowerQuery));
    }

    return matchDate && matchCentre && matchSearch;
  }).sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    if (sortOrder === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="page-title" style={{ margin: 0 }}>Service Requests</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search Name, Phone, Ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', minWidth: '220px' }}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
          />
          <select
            value={filterCentre}
            onChange={(e) => setFilterCentre(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
          >
            <option value="">All Centres</option>
            <option value="Krishnanagar-Ghurni">Krishnanagar-Ghurni</option>
            <option value="Krishnanagar-Bhatjangla">Krishnanagar-Bhatjangla</option>
            <option value="Bethudahari">Bethudahari</option>
            <option value="Habibpur-Ranaghat">Habibpur-Ranaghat</option>
            <option value="Assannagar">Assannagar</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
          >
            <option value="desc">Date (Newest First)</option>
            <option value="asc">Date (Oldest First)</option>
          </select>
        </div>
      </div>
      <div className="data-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref No</th>
              <th>Customer</th>
              <th>Service Type</th>
              <th>Date</th>
              <th>Notes/Issues</th>
              <th>Home Pick Up</th>
              <th>Pick Up Address</th>
              <th>Bill</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '24px' }}>No requests found.</td></tr>
            ) : filteredBookings.map(b => (
              <tr key={b.id} style={{ backgroundColor: b.status === 'Completed' ? '#ecfdf5' : 'transparent' }}>
                <td style={{ fontWeight: 600 }}>{b.refNumber}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.customerName || 'N/A'}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{b.customerPhone}</div>
                  <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>{b.evBike || b.scooterModel || 'N/A'}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{b.serviceCentre || 'No Centre'}</div>
                </td>
                <td>
                  {editingId === b.id ? (
                    <select value={editType} onChange={(e) => setEditType(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                      <option value="Free Service 1">Free Service 1</option>
                      <option value="Free Service 2">Free Service 2</option>
                      <option value="Free Service 3">Free Service 3</option>
                      <option value="Free Service 4">Free Service 4</option>
                      <option value="Others">Others</option>
                    </select>
                  ) : b.serviceType}
                </td>
                <td>
                  {editingId === b.id ? (
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  ) : b.date}
                </td>
                <td style={{ maxWidth: '200px', fontSize: '13px', color: '#475569', fontStyle: b.notes ? 'normal' : 'italic', wordWrap: 'break-word' }}>
                  {b.notes ? `"${b.notes}"` : 'No notes provided'}
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    backgroundColor: b.pickupFromHome ? '#dcfce7' : '#f1f5f9', 
                    color: b.pickupFromHome ? '#16a34a' : '#64748b' 
                  }}>
                    {b.pickupFromHome ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ maxWidth: '200px', fontSize: '13px', color: '#475569', wordWrap: 'break-word' }}>
                  {b.pickupFromHome ? b.pickupAddress : ''}
                </td>
                <td>
                  {b.bill ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 600 }}>{b.billName || 'Uploaded'}</span>
                      <button
                        onClick={() => handleRemoveBill(b.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', padding: '2px', color: '#ef4444' }}
                        title="Remove Bill"
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <label style={{ cursor: 'pointer', color: '#2563eb', fontSize: '13px', fontWeight: 500, textDecoration: 'underline' }}>
                      Upload Bill
                      <input type="file" accept=".pdf, image/jpeg, image/png" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, b.id)} />
                    </label>
                  )}
                </td>
                <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {editingId === b.id ? (
                    <button onClick={() => handleSaveEdit(b.id)} style={{ padding: '6px 12px', background: '#2563eb', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Save</button>
                  ) : (
                    <button onClick={() => { setEditingId(b.id); setEditDate(b.date); setEditType(b.serviceType); }} style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, color: '#334155' }}>Edit</button>
                  )}
                  {b.status !== 'Completed' && (
                    <button onClick={() => handleCompleteService(b.id)} style={{ padding: '6px 12px', background: '#10b981', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Complete</button>
                  )}
                  {b.status === 'Completed' && (
                    <span style={{ padding: '6px 12px', color: '#10b981', fontWeight: 600, fontSize: '13px' }}>Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Segment: Customer Details
function CustomerDetails() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/bookings`).then(res => res.json())
    ]).then(([usersData, bookingsData]) => {
      setUsers(usersData);
      setBookings(bookingsData);
    });
  }, []);

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase();
    const nameMatch = u.name && u.name.toLowerCase().includes(query);
    const phoneMatch = u.phone && u.phone.includes(query);
    return nameMatch || phoneMatch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="page-title" style={{ margin: 0 }}>Customer Details</h2>
        <input
          type="text"
          placeholder="Search name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            width: '280px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
      <div className="user-grid">
        {filteredUsers.length === 0 ? (
          <p>No customers found.</p>
        ) : filteredUsers.map(user => {
          const userBookings = bookings.filter(b => b.customerPhone === user.phone);

          return (
            <div className="user-card" key={user.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="user-card-header">
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                  <h4>{user.name || 'Anonymous User'}</h4>
                  <p>+91-{user.phone}</p>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Password: <strong>{user.password || 'Not set'}</strong></p>
                </div>
              </div>
              <ul className="user-details-list" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
                <li><span>Email:</span> <strong>{user.email || 'N/A'}</strong></li>
                <li><span>Address:</span> <strong>{user.address || 'N/A'}</strong></li>
                <li><span>EV Models Owned:</span> <strong>{user.scootyModels?.join(', ') || 'None'}</strong></li>
              </ul>

              <div className="service-records" style={{ marginTop: 'auto' }}>
                <h5 style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service History</h5>
                {userBookings.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No service records found.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: '0 4px 0 0', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {userBookings.map(b => (
                      <li key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{b.serviceType} <span style={{ fontWeight: 400, color: '#64748b' }}>({b.evBike || b.scooterModel || 'EV Bike'})</span></span>
                          <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{b.date} • {b.serviceCentre || 'N/A'}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>Ref: {b.refNumber}</span>
                          {b.bill && (
                            <a href={b.bill} download={b.billName || `Bill_${b.refNumber}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#2563eb', marginTop: '6px', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content', padding: '2px 6px', backgroundColor: '#eff6ff', borderRadius: '4px' }}>
                              <span>📄</span> Download Bill
                            </a>
                          )}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: '12px',
                          backgroundColor: b.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                          color: b.status === 'Completed' ? '#16a34a' : '#d97706'
                        }}>
                          {b.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Segment: Tickets Raised
function TicketsRaised() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tickets`)
      .then(res => res.json())
      .then(data => setTickets(data));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCloseTicket = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}`}/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Closed' })
      });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="page-title" style={{ marginBottom: '24px' }}>Tickets Raised</h2>
      <div className="user-grid">
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : tickets.map(ticket => (
          <div className="user-card" key={ticket.id} style={{ borderLeft: `4px solid ${ticket.status === 'Closed' ? '#10b981' : '#ef4444'}`, backgroundColor: ticket.status === 'Closed' ? '#ecfdf5' : 'white' }}>
            <div className="user-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ color: '#0f172a', margin: 0 }}>{ticket.customerName || 'Customer'}</h4>
                {ticket.status === 'Closed' ? (
                  <span style={{ color: '#10b981', fontWeight: 600, fontSize: '13px', background: '#d1fae5', padding: '4px 8px', borderRadius: '4px' }}>Closed</span>
                ) : (
                  <button onClick={() => handleCloseTicket(ticket.id)} style={{ padding: '6px 12px', background: '#2563eb', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '12px' }}>Close Ticket</button>
                )}
              </div>
              <p style={{ marginBottom: '12px' }}>+91-{ticket.customerPhone}</p>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '15px', color: '#334155', fontStyle: 'italic' }}>
                "{ticket.issueDescription}"
              </div>
              <p style={{ fontSize: '12px', marginTop: '12px', color: '#94a3b8' }}>
                Submitted: {new Date(ticket.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('requests');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('adminLoggedIn') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'SG_automobile' && password.trim() === 'SG2026') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', width: '100%', maxWidth: '400px', margin: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '8px', fontSize: '24px' }}>Admin Dashboard</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>SG Garai's Electric</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', border: '1px solid #fee2e2' }}>{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Enter username" required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%' }} placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 0 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', marginTop: '8px', transition: 'background-color 0.2s' }}>Login to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ backgroundColor: 'white', padding: '4px', borderRadius: '8px', display: 'flex' }}>
            <Settings color="#1e40af" size={24} />
          </div>
          <span className="sidebar-title">Service Admin</span>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <LayoutDashboard size={20} />
            <span>Service Requests</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={20} />
            <span>Customer Details</span>
          </div>

          <div
            className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            <Ticket size={20} />
            <span>Tickets Raised</span>
          </div>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="main-content">
        <header className="top-header">
          <div style={{ flex: 1 }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>Admin User</span>
              <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '16px' }}>A</div>
            </div>
            <button onClick={handleLogout} style={{ padding: '6px 12px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'requests' && <ServiceRequests />}
          {activeTab === 'customers' && <CustomerDetails />}
          {activeTab === 'tickets' && <TicketsRaised />}
        </div>
      </main>
    </div>
  );
}

export default App;
