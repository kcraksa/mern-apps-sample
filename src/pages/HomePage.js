import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Button, Modal, Form, Input, DatePicker, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Kirim permintaan GET ke endpoint untuk mendapatkan data event
      const response = await axios.get(
        process.env.REACT_APP_API_BASEURL + "/api/event/all"
      );
      // Tangani respons dari server
      const eventData = response.data.data.map((event) => ({
        title: event.email,
        start: event.tanggal, // Sesuaikan dengan nama properti tanggal mulai event di dalam data
      }));
      setEvents(eventData);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    values.tanggal = moment(new Date(values.tanggal)).format("YYYY-MM-DD");
    await axios
      .post(process.env.REACT_APP_API_BASEURL + "/api/event/save", values)
      .then((resp) => {
        message.success(resp.data.message);
        form.resetFields();
        setShowForm(false);
        fetchData();
        setLoading(false);
      });
  };

  const doLogout = async () => {
    try {
      setLoading(true);
      await axios
        .post(process.env.REACT_APP_API_BASEURL + "/api/auth/logout", {
          user: {
            _id: localStorage.getItem("userId"),
          },
        })
        .then((resp) => {
          onLogout();
          setLoading(false);
          navigate("/login");
        });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "100px" }}>
      <div
        style={{
          top: 10,
          right: 10,
          textAlign: "right",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button danger loading={loading} onClick={() => doLogout()}>
            Logout
          </Button>
        </div>
        <div>
          <Button type="primary" onClick={() => setShowForm(true)}>
            Create
          </Button>
        </div>
      </div>
      <h1>Halaman Home</h1>
      <Modal
        title="Create Event"
        open={showForm}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="create-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Silakan masukkan email Anda!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tanggal"
            name="tanggal"
            rules={[{ required: true, message: "Silakan pilih tanggal!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Masukkan Deskripsi!" }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
};

export default HomePage;
