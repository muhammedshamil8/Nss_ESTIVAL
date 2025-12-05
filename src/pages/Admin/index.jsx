import React, { useState, useEffect } from 'react';
import { supabase } from '@/libs/createClient';
import { useAuth } from '@/libs/useAuth';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Typography, Layout, Space, Avatar, message, Drawer, Divider, Select, theme, Menu, Rate } from 'antd';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined, SolutionOutlined, StarOutlined
} from '@ant-design/icons';


const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

function Index() {
  const [users, setUsers] = useState([]);
  const [users2, setUsers2] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [filteredUsers2, setFilteredUsers2] = useState([]);
  const [selectedUser2, setSelectedUser2] = useState(null);
  const [selectedUser3, setSelectedUser3] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openfeedback, setOpenfeedback] = useState(false);
  const [filter, setFilter] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [table, setTable] = useState(localStorage.getItem('table_key') || '1');
  console.log(table, localStorage.getItem('table_key'));

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (table === '1') {
      handleChangeTable('1');
    } else if (table === '2') {
      handleChangeTable('2');
    } else if (table === '3') {
      handleChangeTable('3');
    } else {
      handleChangeTable('1');
    }
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('registeration').select('*');
      if (error) throw error;
      setUsers(data || []);
      // setTable('registeration');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users.');
      setLoading(false);
    }
  }

  async function fetchAbstract() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('abstract_registeration').select('*');
      if (error) throw error;
      setUsers2(data || []);
      setFilteredUsers2(data || []);
      // setTable('abstract');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching abstract_registeration:', error);
      message.error('Failed to fetch abstract_registeration.');
      setLoading(false);
    }
  }

  async function fetchFeedback() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('feedback').select('*');
      if (error) throw error;
      setFeedback(data || []);
      // setTable('feedback');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      message.error('Failed to fetch feedback.');
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
    setSelectedUser(record);
    setOpen(true);
  }

  const handleView2 = (record) => {
    setSelectedUser2(record);
    setOpen2(true);
  }

  const handleViewFeedback = (record) => {
    setSelectedUser3(record);
    setOpenfeedback(true);
  }

  const columns2 = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      className: 'hidden sm:table-cell',
    },
    {
      title: 'Paper Title',
      dataIndex: 'paper_title',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' onClick={() => handleView2(record)}>View</Button>
        </Space>
      ),
    },
  ];

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      className: 'hidden sm:table-cell',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      // render: (image) => <Avatar src={image} alt="Avatar" />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' onClick={() => handleView(record)}>View</Button>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' onClick={() => handleView(record)}>View</Button>
        </Space>
      ),
    },
  ];

  const columsFeedback = [
    {
      title: ' Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: 'hidden sm:table-cell',
    },
    {
      title: 'Affiliation',
      dataIndex: 'affiliation',
      key: 'affiliation',
      // className: 'hidden sm:table-cell',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type='primary' onClick={() => handleViewFeedback(record)}>View</Button>
        </Space>
      ),
    },
  ];

  const onClose = () => {
    setOpen(false);
    setOpen2(false);
    setOpenfeedback(false);
  };

  const ExportButton = (users) => {
    // console.log(users);
    const handleExport = () => {
      // Prepare the data for Excel export
      const data = users.map((user) => {
        return {
          'Full Name': user.full_name,
          'Title': user.title,
          'Affiliation': user.affiliation,
          'Designation/Position': user.designation,
          'Department': user.department,
          'Gender': user.gender,
          'Email': user.email,
          'Phone Number': user.phone_number,
          'Address': user.address,
          'Expertise Field': user.expertise_field,
          'Qualifications': user.qualifications,
          'Experience Years': user.experience_years,
          'Participation Type': user.participation_type,
          'Accommodation Required': user.accommodation_required ? 'Yes' : 'No',
          'Stay Dates': user.stay_dates,
          'Special Requests': user.special_requests,
          'Arrival Info': user.arrival_info,
          'Registration Category': user.registration_category,
          'Payment Mode': user.payment_mode,
          'Transaction ID': user.transaction_id,
          'Transaction Receipt': user.transaction_receipt,
          'Nationality': user.nationality,
        };
      });

      // Create a new workbook and add data to it
      const ws = XLSX.utils.json_to_sheet(data); // Convert data to worksheet

      // Dynamically set column widths
      const colWidths = Object.keys(data[0]).map((key) => ({
        wch: Math.max(
          key.length, // Header length
          ...data.map((user) => (user[key] ? user[key].toString().length : 10)) // Longest data in column
        ),
      }));
      ws['!cols'] = colWidths;

      // Dynamically set row heights (optional)
      const rowHeights = data.map(() => ({ hpt: 20 })); // Example: Fixed height for all rows
      ws['!rows'] = rowHeights;

      const wb = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Users'); // Append the sheet to the workbook

      // Export the workbook to an Excel file
      XLSX.writeFile(wb, 'users_registration_data.xlsx');
    };
    handleExport();
  };

  const ExportButton2 = (users) => {
    // console.log(users);
    const handleExport = () => {
      // Prepare the data for Excel export
      const data = users.map((user) => {
        return {
          'Full Name': user.full_name,
          'Title': user.title,
          'Affiliation': user.affiliation,
          'Designation/Position': user.designation,
          'Department': user.department,
          'Gender': user.gender,
          'Email': user.email,
          'Phone Number': user.phone_number,
          'Address': user.address,
          'preferred_presentation_type': user.preferred_presentation_type,
          'presentation_mode': user.presentation_mode,
          'Paper Title': user.paper_title,
          'Co-Authors': user.co_authors,
          'Abstract File': user.abstract_file,
          'Preferred Session': user.preferred_session,
        };
      });

      // Create a new workbook and add data to it
      const ws = XLSX.utils.json_to_sheet(data); // Convert data to worksheet

      // Dynamically set column widths
      const colWidths = Object.keys(data[0]).map((key) => ({
        wch: Math.max(
          key.length, // Header length
          ...data.map((user) => (user[key] ? user[key].toString().length : 10)) // Longest data in column
        ),
      }));
      ws['!cols'] = colWidths;

      // Dynamically set row heights (optional)
      const rowHeights = data.map(() => ({ hpt: 20 })); // Example: Fixed height for all rows
      ws['!rows'] = rowHeights;


      const wb = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Users'); // Append the sheet to the workbook

      // Export the workbook to an Excel file
      XLSX.writeFile(wb, 'users_abstract_data.xlsx');
    }
    handleExport();
  };

  const ExportButton3 = (users) => {
    const handleExport = () => {
      // Prepare the data for Excel export
      const data = users.map((user) => {
        return {
          'Name': user.name,
          'Email': user.email,
          'Affiliation': user.affiliation,
          'Role': user.role,
          'Ease of Registration': user.registration,
          'Communication and Updates': user.communication,
          'Helpfulness of Organizers': user.helpfulness,
          'Venue Comfort and Accessibility': user.venue_comfort,
          'Audio-Visual and Technical Support': user.audio_visual,
          'Quality of Food': user.food_quality,
          'Accommodation Arrangements': user.accommodation,
          'Relevance of the Theme': user.theme_relevance,
          'Quality of Keynote Speeches': user.keynote_quality,
          'Variety of Topics Covered': user.topics_variety,
          'Opportunities to Connect with Peers': user.peer_connection,
          'Value of Interactions with Speakers and Experts': user.speaker_interaction,
          'Which session did you find most engaging or valuable?': user.most_engaging_session,
          'Were there any sessions you felt could have been improved?': user.improvements,
          'What improvements would you suggest for future conferences': user.suggestions,
          'How likely are you to recommend EMERGE to others': user.recommendation,
          'Additional Comments (Optional)': user.comments,
        };
      });
  
    // Create a new workbook and add data to it
    const ws = XLSX.utils.json_to_sheet(data); // Convert data to worksheet

    // Dynamically set column widths
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(
        key.length, // Header length
        ...data.map((user) => (user[key] ? user[key].toString().length : 10)) // Longest data in column
      ),
    }));
    ws['!cols'] = colWidths;

    // Dynamically set row heights (optional)
    const rowHeights = [{ hpt: 25 }, ...data.map(() => ({ hpt: 20 }))]; // Header row taller, other rows fixed
    ws['!rows'] = rowHeights;


    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Feedback'); // Append the sheet to the workbook

    // Export the workbook to an Excel file
    XLSX.writeFile(wb, 'users_feedback_data.xlsx');
  }
  handleExport();
  };
  


  const downloadFile = async (fileUrl) => {
    if (!fileUrl) {
      message.error('No file found.');
      return;
    }

    try {
      // Check if the file is an image or a file type that the browser previews
      const isImage = /\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(fileUrl);

      // For file types that can be directly downloaded (such as PDFs or images)
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = fileUrl;
      message.success('Successfully downloaded file.');

      // Suggest download for any file by using the 'download' attribute
      link.download = fileUrl.split('/').pop();
      document.body.appendChild(link);

      // Trigger the download

      link.click();

      document.body.removeChild(link);

      if (isImage) {
        window.open(fileUrl, '_blank');
      }

    } catch (error) {
      message.error('Error downloading file: ' + error.message);
    }
  };

  const FilterByTrack = (track) => {
    if (track) {
      setFilter(track);
      const filtered = users2.filter(user => user.preferred_session === track);
      setFilteredUsers2(filtered);
    } else {
      setFilter('');
      setFilteredUsers2(users2);
      // fetchAbstract();
    }
  }

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  // const scroll = { x: 1500, y: 500 };
  const handleChangeTable = (table) => {
    if (table === '1') {
      setTable('1');
      localStorage.setItem('table_key', '1');
      fetchUsers();
    } else if (table === '2') {
      setTable('2');
      localStorage.setItem('table_key', '2');
      fetchAbstract();
    } else if (table === '3') {
      setTable('3');
      localStorage.setItem('table_key', '3');
      fetchFeedback();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Layout >
        <Sider trigger={null} collapsible collapsed={collapsed} style={siderStyle}>
          <div className="demo-logo-vertical" />
          <div className='flex text-white py-6 text-center justify-center font-bold '>
            Emerge 2025
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[table]}
            onClick={({ key }) => handleChangeTable(key)}
            items={[
              {
                key: '1',
                icon: <SolutionOutlined />,
                label: 'Registrations',
              },
              {
                key: '2',
                icon: <FileTextOutlined />,
                label: 'Abstracts',
              },
              {
                key: '3',
                icon: <StarOutlined />,
                label: 'Feedback',
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,

              }}
            />
            {/* <h1 className='text-lg sm:text-xl text-black'>
              Admin Dashboard
            </h1> */}
            <Button type="primary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Header>
          <Content style={{ padding: '20px' }} >

            {/* <Title level={4} className='flex w-full justify-between p-2 flex-wrap'>
              {table === 'registeration' ? 'List of Registered Users' : 'List of Abstract Submissions'}
            </Title> */}
            <div className='flex justify-between items-center gap-2 flex-wrap pb-6'>
              {/* <div className=' flex gap-2 items-center'>
                <Button type='primary' disabled={table === 'registeration'} onClick={() => handleChangeTable('registeration')} size='large' >
                  View Registrations
                </Button>
                <Button type='primary' disabled={table === 'abstract'} onClick={() => handleChangeTable('abstract')} size='large' >
                  View Abstracts
                </Button>
              </div> */}
              {table === '2' &&
                <>
                  <Select
                    size='large'
                    className='w-40 my-2'
                    placeholder="Select a Track"
                    onChange={value => FilterByTrack(value)}
                    options={[
                      { value: 'Humanities, Social Sciences, and Literature', label: 'Humanities...' },
                      { value: 'Science', label: 'Science' },
                      { value: 'Commerce and Management', label: 'Commerce...' },
                    ]}
                  />
                </>
              }
            </div>
            <div className='overflow-auto !bg-white'>
              {table === '2' && (
                <>
                  <Table
                    columns={columns2}
                    dataSource={filteredUsers2.map((user) => ({ ...user, key: user.id }))}
                    bordered
                    loading={loading}
                    pagination={false}
                    title={() => (
                      <div className='flex w-full items-center justify-between gap-4 min-w-[400px]'>
                        <p className='font-bold'>
                          List of Abstract Submissions {filter && `( for ${filter} )`}
                        </p>
                        <Button type='primary' onClick={() => ExportButton2(users2)} size='large' >Export to Excel</Button>
                      </div>
                    )}
                    footer={() => (
                      <div className='flex w-full items-center justify-between gap-4'>
                        <p className='font-bold'>
                          Total Abstract Submissions: {filteredUsers2.length}
                        </p>
                        {/* <Button type='primary' onClick={() => ExportButton2(users2)} size='large' >Export to Excel</Button> */}
                      </div>
                    )}
                  // pagination={{ pageSize: 20 }}
                  />
                  <Drawer
                    title={`User Information: ${selectedUser2?.full_name}`}
                    placement="right"
                    size={'large'}
                    onClose={onClose}
                    open={open2}
                    extra={
                      <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>
                          OK
                        </Button>
                      </Space>
                    }
                    className="custom-drawer pb-10"
                  >

                    <div>

                      <h3>Personal Details</h3>

                      <Divider />
                      <p><strong>Full Name:</strong> {selectedUser2?.full_name || 'N/A'}</p>
                      <p><strong>Title:</strong> {selectedUser2?.title || 'N/A'}</p>
                      <p><strong>Affiliation:</strong> {selectedUser2?.affiliation || 'N/A'}</p>
                      <p><strong>Designation/Position:</strong> {selectedUser2?.designation || 'N/A'}</p>
                      <p><strong>Department:</strong> {selectedUser2?.department || 'N/A'}</p>
                      <p><strong>Gender:</strong> {selectedUser2?.gender || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedUser2?.email || 'N/A'}</p>
                      <p><strong>Phone Number:</strong> {selectedUser2?.phone_number || 'N/A'}</p>
                      <p><strong>Address:</strong> {selectedUser2?.address || 'N/A'}</p>
                    </div>

                    <Divider />
                    {/* Conference Participation Section */}
                    <div>
                      <h3>Professional Details & Conference Participation</h3>
                      <Divider />
                      <p><strong>Field of Expertise:</strong> {selectedUser2?.expertise_field || 'N/A'}</p>
                      <p><strong>Qualifications:</strong> {selectedUser2?.qualifications || 'N/A'}</p>
                      <p><strong>Experience in Years:</strong> {selectedUser2?.experience_years || 'N/A'}</p>
                      <p><strong>Preferred Presentation Type:</strong> {selectedUser2?.preferred_presentation_type || 'N/A'}</p>
                      <p><strong>Presentation Mode:</strong> {selectedUser2?.presentation_mode || 'N/A'}</p>
                      <p><strong>Paper Title:</strong> {selectedUser2?.paper_title || 'N/A'}</p>
                      <p><strong>Co-Authors:</strong> {selectedUser2?.co_authors || 'N/A'}</p>
                      <p><strong>Abstract File:</strong> {selectedUser2?.abstract_file ? 'Uploaded ' : 'N/A'} {selectedUser2?.abstract_file && <button onClick={() => downloadFile(selectedUser2?.abstract_file)} className='bg-blue-500 py-1 px-4 rounded-md text-white active:texgt-white hover:text-white' download={true} > download</button>}</p>
                      <p><strong>Preferred Session:</strong> {selectedUser2?.preferred_session || 'N/A'}</p>
                    </div>

                    <Divider />
                    <Divider />
                  </Drawer>
                </>

              )}
              {table === '1' && (
                <>
                  <Table
                    columns={columns}
                    dataSource={users.map((user) => ({ ...user, key: user.id }))}
                    bordered
                    loading={loading}
                    scroll={scroll}
                    pagination={false}
                    title={() => (
                      <div className='flex w-full items-center justify-between  min-w-[400px]'>
                        <p className='font-bold'>
                          List of Registered Users
                        </p>
                        <Button type='primary' onClick={() => ExportButton(users)} size='large' >Export to Excel</Button>
                      </div>
                    )}
                    footer={() => (
                      <div className='flex w-full items-center justify-between'>
                        <p className='font-bold'>
                          Total Registrations: {users.length}
                        </p>
                        {/* <Button type='primary' onClick={() => ExportButton(users)} size='large' >Export to Excel</Button> */}
                      </div>
                    )}
                  // pagination={{ pageSize: 20 }}
                  />
                  <Drawer
                    title={`User Information: ${selectedUser?.full_name}`}
                    placement="right"
                    size={'large'}
                    onClose={onClose}
                    open={open}
                    extra={
                      <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>
                          OK
                        </Button>
                      </Space>
                    }
                    className="custom-drawer pb-10"
                  >
                    {/* Personal Details Section */}
                    <div>
                      <h3>Personal Details</h3>
                      <Divider />
                      <p><strong>Full Name:</strong> {selectedUser?.full_name || 'N/A'}</p>
                      <p><strong>Title:</strong> {selectedUser?.title || 'N/A'}</p>
                      <p><strong>Affiliation:</strong> {selectedUser?.affiliation || 'N/A'}</p>
                      <p><strong>Designation/Position:</strong> {selectedUser?.designation || 'N/A'}</p>
                      <p><strong>Department:</strong> {selectedUser?.department || 'N/A'}</p>
                      <p><strong>Gender:</strong> {selectedUser?.gender || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedUser?.email || 'N/A'}</p>
                      <p><strong>Phone Number:</strong> {selectedUser?.phone_number || 'N/A'}</p>
                      <p><strong>Address:</strong> {selectedUser?.address || 'N/A'}</p>
                    </div>

                    <Divider />

                    {/* Professional Details Section */}
                    <div>
                      <h3>Professional Details & Conference Participation</h3>
                      <Divider />
                      <p><strong>Field of Expertise:</strong> {selectedUser?.expertise_field || 'N/A'}</p>
                      <p><strong>Qualifications:</strong> {selectedUser?.qualifications || 'N/A'}</p>
                      <p><strong>Experience in Years:</strong> {selectedUser?.experience_years || 'N/A'}</p>
                      <p><strong>Type of Participation:</strong> {selectedUser?.participation_type || 'N/A'}</p>

                    </div>

                    <Divider />

                    {/* Accommodation & Travel Section */}
                    <div>
                      <h3>Accommodation & Travel</h3>
                      <Divider />
                      <p><strong>Accommodation Required:</strong> {selectedUser?.accommodation_required ? 'Yes' : 'No'}</p>
                      <p><strong>Stay Dates:</strong> {selectedUser?.stay_dates || 'N/A'}</p>
                      <p><strong>Special Requests:</strong> {selectedUser?.special_requests ? 'Uploaded ' : 'N/A'}{selectedUser?.special_requests && <button onClick={() => downloadFile(selectedUser?.special_requests)} className='bg-blue-500 py-1 px-4 rounded-md text-white active:texgt-white hover:text-white' download={true} > download</button>}</p>
                      <p><strong>Arrival Info:</strong> {selectedUser?.arrival_info || 'N/A'}</p>
                    </div>

                    <Divider />

                    {/* Payment Details Section */}
                    <div>
                      <h3>Payment Details</h3>
                      <Divider />
                      <p><strong>Registration Category:</strong> {selectedUser?.registration_category || 'N/A'}</p>
                      <p><strong>Payment Mode:</strong> {selectedUser?.payment_mode || 'N/A'}</p>
                      <p><strong>Transaction ID:</strong> {selectedUser?.transaction_id || 'N/A'}</p>
                      <p><strong>Transaction Receipt:</strong> {selectedUser?.transaction_receipt ? 'Uploaded ' : 'N/A'} {selectedUser?.transaction_receipt && <button onClick={() => downloadFile(selectedUser?.transaction_receipt)} className='bg-blue-500 py-1 px-4 rounded-md text-white active:texgt-white hover:text-white' download={true} > download</button>}</p>
                      <p><strong>Nationality:</strong> {selectedUser?.nationality || 'N/A'}</p>
                    </div>
                  </Drawer>
                </>
              )}
              {table === '3' && (
                <>
                  <Table
                    columns={columsFeedback}
                    dataSource={feedback.map((user) => ({ ...user, key: user.id }))}
                    bordered
                    loading={loading}
                    scroll={scroll}
                    pagination={false}
                    title={() => (
                      <div className='flex w-full items-center justify-between  min-w-[200px]'>
                        <p className='font-bold'>
                          List of Feedbacks
                        </p>
                        <Button type='primary' onClick={() => ExportButton3(feedback)} size='large' >Export to Excel</Button>
                      </div>
                    )}
                    footer={() => (
                      <div className='flex w-full items-center justify-between'>
                        <p className='font-bold'>
                          Total Feedback: {feedback.length}
                        </p>
                      </div>
                    )}
                  />
                  <Drawer
                    key={selectedUser3?.id}
                    title={`Feedback information: ${selectedUser3?.name}`}
                    placement="right"
                    size={'large'}
                    onClose={onClose}
                    open={openfeedback}
                    extra={
                      <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>
                          OK
                        </Button>
                      </Space>
                    }
                    className="custom-drawer pb-10"
                  >
                    {/* Personal Details Section */}
                    <div>
                      <h3>1. Personal Details</h3>
                      <Divider />
                      <p><strong>Full Name:</strong> {selectedUser3?.name || 'N/A'}</p>
                      <p><strong>Affiliation:</strong> {selectedUser3?.affiliation || 'N/A'}</p>
                      <p><strong>Role:</strong> {selectedUser3?.role || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedUser3?.email || 'N/A'}</p>
                    </div>

                    <Divider />

                    {/* Professional Details Section */}
                    <div>
                      <h3>2. Pre-Conference Arrangements</h3>
                      <Divider />
                      <p className='flex flex-col'><strong>Ease of Registration: </strong><Rate disabled defaultValue={Number(selectedUser3?.registration)} /></p>
                      <p className='flex flex-col'><strong>Communication and Updates:</strong>  <Rate disabled defaultValue={selectedUser3?.communication} /></p>
                      <p className='flex flex-col'><strong>Helpfulness of Organizers:</strong><Rate disabled defaultValue={selectedUser3?.helpfulness} /></p>

                    </div>

                    <Divider />

                    {/* Accommodation & Travel Section */}
                    <div>
                      <h3>3. Venue and Facilities</h3>
                      <Divider />
                      <p className='flex flex-col'><strong>Venue Comfort and Accessibility:</strong> <Rate disabled defaultValue={selectedUser3?.venue_comfort} /> </p>
                      <p className='flex flex-col'><strong>Audio-Visual and Technical Support:</strong> <Rate disabled defaultValue={selectedUser3?.audio_visual} /> </p>
                      <p className='flex flex-col'><strong>Quality of Food:</strong> <Rate disabled defaultValue={selectedUser3?.food_quality} /> </p>
                      <p className='flex flex-col'><strong>Accommodation Arrangements:</strong> <Rate disabled defaultValue={selectedUser3?.accommodation} /> </p>

                    </div>

                    <Divider />

                    {/* Payment Details Section */}
                    <div>
                      <h3>4. Conference Content</h3>
                      <Divider />
                      <p className='flex flex-col'><strong>Relevance of the Theme:</strong>  <Rate disabled defaultValue={selectedUser3?.theme_relevance} /></p>
                      <p className='flex flex-col'><strong>Quality of Keynote Speeches:</strong>  <Rate disabled defaultValue={selectedUser3?.keynote_quality} /></p>
                      <p className='flex flex-col'><strong>Variety of Topics Covered:</strong>  <Rate disabled defaultValue={selectedUser3?.topics_variety} /></p>

                    </div>
                    <Divider />
                    <div>
                      <h3>5. Networking Opportunities</h3>
                      <Divider />
                      <p className='flex flex-col'><strong>Opportunities to Connect with Peers:</strong> <Rate disabled defaultValue={selectedUser3?.peer_connection} /> </p>
                      <p className='flex flex-col'><strong>Value of Interactions with Speakers and Experts:</strong>  <Rate disabled defaultValue={selectedUser3?.speaker_interaction} /></p>

                    </div>
                    <Divider />
                    <div>
                      <h3>6. Specific Sessions</h3>
                      <Divider />
                      <p className='flex flex-col'><strong>Which session did you find most engaging or valuable?:</strong> {selectedUser3?.most_engaging_session || 'N/A'}</p>
                      <p className='flex flex-col'><strong>Were there any sessions you felt could have been improved?:</strong> {selectedUser3?.improvements || 'N/A'}</p>

                    </div>
                    <Divider />
                    <div>
                      <h3>7. Suggestions for Improvement</h3>
                      <Divider />
                      <p className='flex flex-col'><strong>What improvements would you suggest for future conferences?:</strong> {selectedUser3?.suggestions || 'N/A'}</p>


                    </div>
                    <Divider />
                    <div>
                      <h3>8. Overall Experience</h3>
                      <Divider />
                      <p className='flex flex-col'><strong>How likely are you to recommend EMERGE to others?:</strong>  <Rate disabled defaultValue={selectedUser3?.recommendation} /></p>

                    </div>
                    <Divider />
                    <div>
                      <h3>9. Additional Comments</h3>
                      <Divider />
                      <p className='flex flex-col'><strong>Additional Comments (Optional):</strong> {selectedUser3?.comments || 'N/A'}</p>

                    </div>
                  </Drawer>
                </>
              )}
            </div>

          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>© 2025 EMERGE 2025</Footer> */}
        </Layout>
      </Layout>
    </motion.div >
  );
}

export default Index;
