import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPages = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        process.env.REACT_APP_API_BASEURL + "/api/auth/login",
        values
      );
      setLoading(false);
      navigate("/home");
      onLogin(response.data.user);
      console.log(response.data); // Mengecek response dari server
      // Tambahkan logika untuk menyimpan token dan menavigasi ke halaman lain di sini
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.response.data);
      message.error(
        error.response.data.msg || "Terjadi kesalahan. Silakan coba lagi."
      );
    }
  };

  return (
    <div style={{ width: 300, margin: "auto", marginTop: 50 }}>
      <h2>Login</h2>
      <Form name="login-form" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Silakan masukkan email Anda!" },
            { type: "email", message: "Format email tidak valid!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Silakan masukkan password Anda!" },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPages;
