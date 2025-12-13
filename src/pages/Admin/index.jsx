import React, { useState, useEffect } from 'react';
import { supabase } from '@/libs/createClient';
import { useAuth } from '@/libs/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Table, Button, Typography, Layout, Space, message, Drawer, 
  Divider, Select, theme, Menu, Tag, Image, Card, Badge, Modal, 
  Tooltip, Alert, Input, Popconfirm 
} from 'antd';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  SolutionOutlined,
  TeamOutlined,
  EyeOutlined,
  DownloadOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;
const { Search } = Input;

// Define your 6 events
const EVENTS = [
  {
    name: "Fashion Show",
    prize: "₹27,000",
    slug: "fashion-show",
    emoji: "👗",
    color: "from-pink-500 to-purple-600",
  },
  {
    name: "Group Dance",
    prize: "₹27,000",
    slug: "group-dance",
    emoji: "💃",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Best Volunteer",
    prize: "₹21,000",
    slug: "best-volunteer",
    emoji: "⭐",
    color: "from-yellow-500 to-orange-600",
  },
  {
    name: "Treasure Hunt",
    prize: "₹17,000",
    slug: "treasure-hunt",
    emoji: "🗺️",
    color: "from-green-500 to-teal-600",
  },
  {
    name: "Spot Photography",
    prize: "₹10,000",
    slug: "spot-photography",
    emoji: "📸",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Spot Reel Making",
    prize: "₹10,000",
    slug: "spot-reel-making",
    emoji: "🎬",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Face Painting",
    prize: "₹10,000",
    slug: "face-painting",
    emoji: "🎨",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "Next Talk",
    prize: "0",
    slug: "next-talk",
    emoji: "🗣️",
    color: "from-green-500 to-teal-600",
  }
];

function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [open, setOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'verified', 'pending'
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Fetch registrations
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Calculate statistics whenever registrations change
  useEffect(() => {
    calculateStats();
  }, [registrations]);

  // Filter registrations when filters change
  useEffect(() => {
    filterRegistrations();
  }, [eventFilter, paymentFilter, searchText, registrations]);

  async function fetchRegistrations() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure payment_verified field exists (default to false if not)
      const registrationsWithPayment = data.map(reg => ({
        ...reg,
        payment_verified: reg.payment_verified || false,
        payment_status: reg.payment_verified ? 'verified' : 'pending'
      }));
      
      setRegistrations(registrationsWithPayment || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      message.error('Failed to fetch registrations.');
    } finally {
      setLoading(false);
    }
  }

  const calculateStats = () => {
    const total = registrations.length;
    const verified = registrations.filter(reg => reg.payment_verified).length;
    const pending = registrations.filter(reg => !reg.payment_verified).length;
    
    // Calculate per event stats
    const eventStats = {};
    EVENTS.forEach(event => {
      const eventRegs = registrations.filter(reg => reg.event_slug === event.slug);
      eventStats[event.slug] = {
        total: eventRegs.length,
        verified: eventRegs.filter(reg => reg.payment_verified).length,
        pending: eventRegs.filter(reg => !reg.payment_verified).length,
      };
    });

    setStats({
      total,
      verified,
      pending,
      eventStats
    });
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];

    // Apply event filter
    if (eventFilter) {
      filtered = filtered.filter(reg => reg.event_slug === eventFilter);
    }

    // Apply payment filter
    if (paymentFilter === 'verified') {
      filtered = filtered.filter(reg => reg.payment_verified);
    } else if (paymentFilter === 'pending') {
      filtered = filtered.filter(reg => !reg.payment_verified);
    }

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(reg => 
        reg.college?.toLowerCase().includes(searchLower) ||
        reg.officer?.toLowerCase().includes(searchLower) ||
        reg.officer_phone?.includes(searchText) ||
        (reg.participants?.some(p => 
          p.name?.toLowerCase().includes(searchLower) || 
          p.phone?.includes(searchText)
        ))
      );
    }

    setFilteredRegistrations(filtered);
  };

  // Payment Verification Function
  const verifyPayment = async (registrationId) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          payment_verified: true,
          verified_at: new Date().toISOString(),
          // verified_by: user?.email || 'admin'
        })
        .eq('id', registrationId);

      if (error) throw error;

      // Update local state
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId ? { 
            ...reg, 
            payment_verified: true,
            verified_at: new Date().toISOString(),
            // verified_by: user?.email || 'admin'
          } : reg
        )
      );

      message.success('Payment verified successfully!');
    } catch (error) {
      console.error('Error verifying payment:', error);
      message.error('Failed to verify payment.');
    }
  };

  // Unverify Payment Function
  const unverifyPayment = async (registrationId) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          payment_verified: false,
          verified_at: null,
          // verified_by: null
        })
        .eq('id', registrationId);

      if (error) throw error;

      // Update local state
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId ? { 
            ...reg, 
            payment_verified: false,
            verified_at: null,
            // verified_by: null
          } : reg
        )
      );

      message.success('Payment unverified successfully!');
    } catch (error) {
      console.error('Error unverifying payment:', error);
      message.error('Failed to unverify payment.');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
      message.success('Signed out successfully.');
    } catch (error) {
      console.error('Error signing out user:', error);
      message.error('Failed to sign out.');
    }
  };

  const handleView = (record) => {
    setSelectedRegistration(record);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedRegistration(null);
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const data = filteredRegistrations.map((reg, index) => {
        const participants = reg.participants || [];
        const participantData = participants.reduce((acc, participant, idx) => {
          acc[`Participant ${idx + 1} Name`] = participant.name || '';
          acc[`Participant ${idx + 1} Phone`] = participant.phone || '';
          return acc;
        }, {});

        return {
          'S.No': index + 1,
          'Event Name': reg.event_name || 'N/A',
          'College': reg.college || 'N/A',
          'Program Officer': reg.officer || 'N/A',
          'Officer Phone': reg.officer_phone || 'N/A',
          'Payment Verified': reg.payment_verified ? 'Yes' : 'No',
          'Receipt URL': reg.receipt_url || 'N/A',
          'Registration Date': reg.created_at ? new Date(reg.created_at).toLocaleString() : 'N/A',
          ...participantData,
        };
      });

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `registrations_${dateStr}.xlsx`;

      XLSX.writeFile(wb, fileName);
      message.success('Excel file exported successfully!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      message.error('Failed to export Excel file.');
    }
  };

  // Download receipt
  const downloadReceipt = (receiptUrl) => {
    if (!receiptUrl) {
      message.warning('No receipt available.');
      return;
    }
    
    const link = document.createElement('a');
    link.href = receiptUrl;
    link.download = `receipt_${Date.now()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table columns (with payment verification actions)
  const columns = [
    {
      title: 'S.No',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: 'Event',
      dataIndex: 'event_name',
      key: 'event_name',
      render: (text, record) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-xs text-gray-500">{record.event_slug}</div>
        </div>
      ),
    },
    {
      title: 'College',
      dataIndex: 'college',
      key: 'college',
      ellipsis: true,
    },
    {
      title: 'Payment Status',
      key: 'payment_status',
      render: (_, record) => (
        <Tag 
          color={record.payment_verified ? 'green' : 'orange'}
          icon={record.payment_verified ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {record.payment_verified ? 'Verified' : 'Pending'}
        </Tag>
      ),
      filters: [
        { text: 'Verified', value: 'verified' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => 
        value === 'verified' ? record.payment_verified : !record.payment_verified,
    },
    {
      title: 'Officer',
      key: 'officer',
      render: (_, record) => (
        <div>
          <div>{record.officer}</div>
          <div className="text-xs text-gray-500">{record.officer_phone}</div>
        </div>
      ),
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants) => (
        <div className="text-sm">
          {participants?.length || 0} registered
        </div>
      ),
    },
    {
      title: 'Receipt',
      dataIndex: 'receipt_url',
      key: 'receipt_url',
      render: (receiptUrl) => (
        receiptUrl ? (
          <Tag color="blue" icon={<DownloadOutlined />}>
            <a 
              href={receiptUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              View
            </a>
          </Tag>
        ) : (
          <Tag color="default">No receipt</Tag>
        )
      ),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => (
        <div className="text-xs">
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record)}
              size="small"
            />
          </Tooltip>
          
          {!record.payment_verified ? (
            <Popconfirm
              title="Verify Payment"
              description="Are you sure you want to verify this payment?"
              onConfirm={() => verifyPayment(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Verify Payment">
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />} 
                  size="small"
                  className="bg-green-500 hover:bg-green-600 border-green-500"
                />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Unverify Payment"
              description="Are you sure you want to mark this payment as unverified?"
              onConfirm={() => unverifyPayment(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Unverify Payment">
                <Button 
                  danger
                  icon={<CloseOutlined />} 
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Event filter options
  const eventOptions = [
    { value: '', label: 'All Events' },
    ...EVENTS.map(event => ({
      value: event.slug,
      label: `${event.name} (${stats.eventStats?.[event.slug]?.total || 0})`,
    }))
  ];

  // Payment filter options
  const paymentOptions = [
    { value: 'all', label: 'All Payments' },
    { value: 'verified', label: 'Verified Only' },
    { value: 'pending', label: 'Pending Only' },
  ];

  // Menu items with event submenu
  const menuItems = [
    // {
    //   key: 'dashboard',
    //   icon: <AppstoreOutlined />,
    //   label: 'Dashboard',
    // },
    {
      key: 'dashboard',
      icon: <SolutionOutlined />,
      label: 'All Registrations',
    },
    {
      key: 'events',
      icon: <TeamOutlined />,
      label: 'Events',
      children: EVENTS.map(event => ({
        key: `event-${event.slug}`,
        label: event.name,
      })),
    },
  ];

  // Handle menu click
  const handleMenuClick = (e) => {
    setActiveMenu(e.key);
    
    if (e.key.startsWith('event-')) {
      const eventSlug = e.key.replace('event-', '');
      const event = EVENTS.find(ev => ev.slug === eventSlug);
      setSelectedEvent(event);
      setEventFilter(eventSlug);
    } else {
      setSelectedEvent(null);
      if (e.key === 'dashboard') {
        setEventFilter('');
      }
    }
  };

  // Render content based on active menu
  const renderContent = () => {
    if (activeMenu === 'dashboard' || !selectedEvent) {
      return (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.total || 0}</div>
                <div className="text-gray-600">Total Registrations</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.verified || 0}</div>
                <div className="text-gray-600">Verified Payments</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.pending || 0}</div>
                <div className="text-gray-600">Pending Verification</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {new Set(registrations.map(reg => reg.college)).size}
                </div>
                <div className="text-gray-600">Colleges</div>
              </div>
            </Card>
          </div>

          {/* Event Cards */}
          <Title level={4} className="mb-4">Events Overview</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {EVENTS.map((event) => {
              const eventStat = stats.eventStats?.[event.slug] || { total: 0, verified: 0, pending: 0 };
              return (
                <Card
                  key={event.slug}
                  hoverable
                  onClick={() => {
                    setSelectedEvent(event);
                    setEventFilter(event.slug);
                    setActiveMenu(`event-${event.slug}`);
                  }}
                  className="relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{event.emoji}</span>
                        <h3 className="text-lg font-semibold">{event.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Prize: {event.prize}</p>
                    </div>
                    <Badge 
                      count={eventStat.total} 
                      style={{ backgroundColor: '#1890ff' }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <Tag color="green">{eventStat.verified} Verified</Tag>
                    <Tag color="orange">{eventStat.pending} Pending</Tag>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      );
    }

    // Event-specific view
    return (
      <div>
        {selectedEvent && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedEvent.emoji}</span>
                  <div>
                    <Title level={2} className="mb-0">{selectedEvent.name}</Title>
                    <Text type="secondary">Prize: {selectedEvent.prize}</Text>
                  </div>
                </div>
                <div className="mt-2 flex gap-4">
                  <Tag color="blue">Total: {stats.eventStats?.[selectedEvent.slug]?.total || 0}</Tag>
                  <Tag color="green">Verified: {stats.eventStats?.[selectedEvent.slug]?.verified || 0}</Tag>
                  <Tag color="orange">Pending: {stats.eventStats?.[selectedEvent.slug]?.pending || 0}</Tag>
                </div>
              </div>
              <Button 
                type="link" 
                onClick={() => {
                  setSelectedEvent(null);
                  setEventFilter('');
                  setActiveMenu('dashboard');
                }}
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            insetInlineStart: 0,
            top: 0,
          }}
        >
          <div className="p-4 text-white text-center font-bold text-lg">
            {collapsed ? 'EST' : 'Estival Admin'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeMenu]}
            onClick={handleMenuClick}
            items={menuItems}
            defaultOpenKeys={['events']}
          />
        </Sider>
        
        <Layout>
          <Header
            style={{
              padding: '0 20px',
              background: colorBgContainer,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div className="flex items-center">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ marginRight: 16 }}
              />
              <Title level={4} style={{ margin: 0 }}>
                {selectedEvent ? `${selectedEvent.name} Registrations` : 'Admin Dashboard'}
              </Title>
            </div>
            
            <Space>
              <Text type="secondary">{user?.email}</Text>
              <Button type="primary" danger onClick={handleSignOut}>
                Sign Out
              </Button>
            </Space>
          </Header>
          
          <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer }}>
            {/* Render Dashboard or Event View */}
            {renderContent()}

            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                <div className="flex flex-col md:flex-row gap-4">
                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter by Event"
                    value={eventFilter}
                    onChange={(value) => {
                      setEventFilter(value);
                      if (value) {
                        const event = EVENTS.find(ev => ev.slug === value);
                        setSelectedEvent(event);
                        setActiveMenu(`event-${value}`);
                      } else {
                        setSelectedEvent(null);
                        setActiveMenu('dashboard');
                      }
                    }}
                    options={eventOptions}
                    allowClear
                  />
                  
                  <Select
                    style={{ width: 200 }}
                    placeholder="Payment Status"
                    value={paymentFilter}
                    onChange={setPaymentFilter}
                    options={paymentOptions}
                  />
                </div>
                
                <Search
                  placeholder="Search by college, officer, or participant..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  style={{ width: 300 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={filterRegistrations}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={fetchRegistrations}
                  loading={loading}
                  icon={<FileTextOutlined />}
                >
                  Refresh
                </Button>
                
                <Button 
                  type="primary" 
                  onClick={handleExportExcel}
                  icon={<DownloadOutlined />}
                >
                  Export Excel
                </Button>
              </div>
            </div>

            {/* Registrations Table */}
            <Alert
              message={`Showing ${filteredRegistrations.length} registrations`}
              type="info"
              showIcon
              className="mb-4"
              action={
                <Space>
                  <Badge count={stats.verified} style={{ backgroundColor: '#52c41a' }} />
                  <Badge count={stats.pending} style={{ backgroundColor: '#fa8c16' }} />
                </Space>
              }
            />
            
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={filteredRegistrations.map((reg, index) => ({ ...reg, key: reg.id }))}
                loading={loading}
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} registrations`,
                }}
                scroll={{ x: 1300 }}
              />
            </div>

            {/* Registration Details Drawer */}
            <Drawer
              title="Registration Details"
              placement="right"
              size="large"
              onClose={onClose}
              open={open}
              extra={
                <Space>
                  {selectedRegistration?.receipt_url && (
                    <Button 
                      icon={<DownloadOutlined />}
                      onClick={() => downloadReceipt(selectedRegistration.receipt_url)}
                    >
                      Download Receipt
                    </Button>
                  )}
                  <Button onClick={onClose}>Close</Button>
                </Space>
              }
            >
              {selectedRegistration && (
                <div className="space-y-6">
                  {/* Payment Verification Section */}
                  <Card 
                    title="Payment Verification" 
                    size="small"
                    extra={
                      <Tag 
                        color={selectedRegistration.payment_verified ? 'green' : 'orange'}
                        icon={selectedRegistration.payment_verified ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                      >
                        {selectedRegistration.payment_verified ? 'Verified' : 'Pending'}
                      </Tag>
                    }
                  >
                    {selectedRegistration.payment_verified ? (
                      <div className="space-y-3">
                        <div className="text-green-600 font-semibold">
                          ✓ Payment Verified
                        </div>
                        <div>
                          <strong>Verified By:</strong> Admin
                        </div>
                        <div>
                          <strong>Verified At:</strong> {selectedRegistration.verified_at ? 
                            new Date(selectedRegistration.verified_at).toLocaleString() : 'N/A'}
                        </div>
                        <Popconfirm
                          title="Unverify Payment"
                          description="Are you sure you want to mark this payment as unverified?"
                          onConfirm={() => {
                            unverifyPayment(selectedRegistration.id);
                            onClose();
                          }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger icon={<CloseOutlined />}>
                            Mark as Unverified
                          </Button>
                        </Popconfirm>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-orange-600 font-semibold">
                          ⏳ Payment Pending Verification
                        </div>
                        <Popconfirm
                          title="Verify Payment"
                          description="Are you sure you want to verify this payment?"
                          onConfirm={() => {
                            verifyPayment(selectedRegistration.id);
                            onClose();
                          }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button 
                            type="primary" 
                            icon={<CheckOutlined />}
                            className="bg-green-500 hover:bg-green-600 border-green-500"
                          >
                            Verify Payment
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  </Card>

                  {/* Event Information */}
                  <Card title="Event Information" size="small">
                    <div className="space-y-2">
                      <div>
                        <strong>Event:</strong>
                        <div className="font-bold text-lg text-blue-600">{selectedRegistration.event_name}</div>
                        <div className="text-gray-500 text-sm">Slug: {selectedRegistration.event_slug}</div>
                      </div>
                      <div>
                        <strong>Registration Date:</strong>
                        <div>{new Date(selectedRegistration.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  </Card>

                  {/* College Information */}
                  <Card title="College Information" size="small">
                    <div className="space-y-2">
                      <div>
                        <strong>College Name:</strong>
                        <div className="font-semibold text-lg">{selectedRegistration.college}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <strong>Program Officer:</strong>
                          <div>{selectedRegistration.officer}</div>
                        </div>
                        <div>
                          <strong>Officer Phone:</strong>
                          <div className="font-mono">{selectedRegistration.officer_phone}</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Participants Information */}
                  <Card title="Participants" size="small">
                    <div className="space-y-3">
                      {selectedRegistration.participants?.map((participant, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="font-semibold text-gray-700 mb-1">
                            Participant {index + 1}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Name</div>
                              <div>{participant.name}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <div className="font-mono">{participant.phone}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Payment Receipt */}
                  {selectedRegistration.receipt_url && (
                    <Card title="Payment Receipt" size="small">
                      <div className="space-y-3">
                        {/* <div>
                          <strong>Receipt URL:</strong>
                          <div className="truncate text-blue-600">
                            <a 
                              href={selectedRegistration.receipt_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block truncate"
                            >
                              {selectedRegistration.receipt_url}
                            </a>
                          </div>
                        </div> */}
                        <div>
                          <strong>Preview:</strong>
                          <div className="mt-2">
                            <Image
                              src={selectedRegistration.receipt_url}
                              alt="Payment Receipt"
                              style={{ maxHeight: 200, width: 'auto' }}
                              preview={{
                                mask: <div>View Full Size</div>
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </Drawer>
          </Content>
        </Layout>
      </Layout>
    </motion.div>
  );
}

export default AdminDashboard;