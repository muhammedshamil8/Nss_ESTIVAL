import React, { useState, useEffect } from 'react';
import { supabase } from '@/libs/createClient';
import { useAuth } from '@/libs/useAuth';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Typography, Layout, Space, message, Drawer, Divider, Select, theme, Menu, Tag, Image, Card } from 'antd';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  SolutionOutlined,
  TeamOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [open, setOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState('');
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Fetch all events for filter dropdown
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch registrations
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Filter registrations when event filter changes
  useEffect(() => {
    if (eventFilter) {
      const filtered = registrations.filter(reg => reg.event_slug === eventFilter);
      setFilteredRegistrations(filtered);
    } else {
      setFilteredRegistrations(registrations);
    }
  }, [eventFilter, registrations]);

  async function fetchEvents() {
    try {
      // Assuming you have an events table or get from EVENTS config
      // If not, you can extract unique events from registrations
      const { data, error } = await supabase
        .from('registrations')
        .select('event_slug, event_name')
        .order('event_name');
      
      if (error) throw error;
      
      // Get unique events
      const uniqueEvents = Array.from(
        new Map(data.map(item => [item.event_slug, item])).values()
      );
      setEvents(uniqueEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Failed to fetch events.');
    }
  }

  async function fetchRegistrations() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRegistrations(data || []);
      setFilteredRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      message.error('Failed to fetch registrations.');
    } finally {
      setLoading(false);
    }
  }

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
        // Flatten participants into separate columns
        const participants = reg.participants || [];
        const participantData = participants.reduce((acc, participant, idx) => {
          acc[`Participant ${idx + 1} Name`] = participant.name || '';
          acc[`Participant ${idx + 1} Phone`] = participant.phone || '';
          return acc;
        }, {});

        return {
          'S.No': index + 1,
          'Event Name': reg.event_name || 'N/A',
          'Event Slug': reg.event_slug || 'N/A',
          'College': reg.college || 'N/A',
          'Program Officer': reg.officer || 'N/A',
          'Officer Phone': reg.officer_phone || 'N/A',
          'Receipt URL': reg.receipt_url || 'N/A',
          'Registration Date': reg.created_at ? new Date(reg.created_at).toLocaleString() : 'N/A',
          ...participantData,
        };
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Set column widths
      const colWidths = [
        { wch: 5 },   // S.No
        { wch: 30 },  // Event Name
        { wch: 20 },  // Event Slug
        { wch: 30 },  // College
        { wch: 25 },  // Program Officer
        { wch: 15 },  // Officer Phone
        { wch: 50 },  // Receipt URL
        { wch: 20 },  // Registration Date
      ];
      
      // Add widths for participant columns
      const maxParticipants = Math.max(...filteredRegistrations.map(reg => (reg.participants || []).length));
      for (let i = 1; i <= maxParticipants; i++) {
        colWidths.push({ wch: 25 }); // Name
        colWidths.push({ wch: 15 }); // Phone
      }
      
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

      // Generate filename with date
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `registrations_${dateStr}.xlsx`;

      // Export file
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

  // Table columns
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
      title: 'Program Officer',
      dataIndex: 'officer',
      key: 'officer',
      render: (text, record) => (
        <div>
          <div>{text}</div>
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
          <Tag color="green" icon={<DownloadOutlined />}>
            <a 
              href={receiptUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600"
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
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
            size="small"
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  // Format event filter options
  const eventOptions = [
    { value: '', label: 'All Events' },
    ...events.map(event => ({
      value: event.event_slug,
      label: event.event_name,
    }))
  ];

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
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <SolutionOutlined />,
                label: 'Registrations',
              },
              {
                key: '2',
                icon: <TeamOutlined />,
                label: 'Participants',
              },
              {
                key: '3',
                icon: <FileTextOutlined />,
                label: 'Reports',
              },
            ]}
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
              <Title level={4} style={{ margin: 0 }}>Registration Dashboard</Title>
            </div>
            
            <Space>
              <Text type="secondary">{user?.email}</Text>
              <Button type="primary" danger onClick={handleSignOut}>
                Sign Out
              </Button>
            </Space>
          </Header>
          
          <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer }}>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{registrations.length}</div>
                  <div className="text-gray-600">Total Registrations</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {registrations.reduce((acc, reg) => acc + (reg.participants?.length || 0), 0)}
                  </div>
                  <div className="text-gray-600">Total Participants</div>
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
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {new Set(registrations.map(reg => reg.event_slug)).size}
                  </div>
                  <div className="text-gray-600">Events</div>
                </div>
              </Card>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Select
                  style={{ width: 250 }}
                  placeholder="Filter by Event"
                  value={eventFilter}
                  onChange={setEventFilter}
                  options={eventOptions}
                  allowClear
                />
                
                <Button 
                  onClick={fetchRegistrations}
                  loading={loading}
                  icon={<FileTextOutlined />}
                >
                  Refresh
                </Button>
              </div>
              
              <div className="flex gap-2">
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
                scroll={{ x: 1200 }}
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
                  <Button onClick={onClose}>Close</Button>
                </Space>
              }
            >
              {selectedRegistration && (
                <div className="space-y-6">
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
                        <div>
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
                        </div>
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
                        <div>
                          <Button 
                            type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={() => downloadReceipt(selectedRegistration.receipt_url)}
                            block
                          >
                            Download Receipt
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Metadata */}
                  <Card title="System Information" size="small">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <strong>Registration ID:</strong> {selectedRegistration.id}
                      </div>
                      <div>
                        <strong>Created At:</strong> {new Date(selectedRegistration.created_at).toLocaleString()}
                      </div>
                      <div>
                        <strong>Updated At:</strong> {selectedRegistration.updated_at ? 
                          new Date(selectedRegistration.updated_at).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </Card>
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