import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/libs/createClient';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { motion } from 'framer-motion';

const { Title } = Typography;

function Auth() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      setSession(user);
      setLoading(false);
      message.success('Signed in successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      message.error('Sign-in failed');
      console.error('Error during sign-in:', error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}
    >
      <Card style={{ maxWidth: 400, width: '100%', padding: '20px' }} bordered>
        <Title level={3} style={{ textAlign: 'center' }}>
          Admin Sign In
        </Title>
        {!session && (
          <Form layout="vertical" onFinish={handleSignIn}>
            <Form.Item label="Email" size='large' name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
              <Input
                type="email"
                size='large'
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Password" size='large' name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
              <Input.Password
                placeholder="Password"
                size='large'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button disabled={loading} loading={loading} type="primary" size='large' htmlType="submit" block>
                Sign In
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </motion.div>
  );
}

export default Auth;
