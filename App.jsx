
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  LayoutDashboard,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react";

import LandingPage from "./pages/LandingPage";
import PatientAuth from "./pages/PatientAuth";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [activePortal, setActivePortal] = useState(null);
  const [patientSession, setPatientSession] = useState(null);
  const [page, setPage] = useState("dashboard");

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [patientName, setPatientName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  async function loadData() {
    try {
      const [doctorResponse, appointmentResponse] =
        await Promise.all([
          fetch(`${API}/doctors`),
          fetch(`${API}/appointments`),
        ]);

      if (!doctorResponse.ok || !appointmentResponse.ok) {
        throw new Error("Unable to retrieve hospital data");
      }

      const doctorData = await doctorResponse.json();
      const appointmentData = await appointmentResponse.json();

      setDoctors(doctorData);
      setAppointments(appointmentData);
      setConnected(true);
      setError("");
    } catch {
      setConnected(false);
      setError("Unable to connect to the hospital server.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleBooking(event) {
    event.preventDefault();

    if (!patientName.trim() || !doctorId) return;

    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const response = await fetch(`${API}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_name: patientName.trim(),
          doctor_id: Number(doctorId),
        }),
      });

      if (!response.ok) {
        throw new Error("Appointment booking failed");
      }

      const data = await response.json();

      setBooking(data);
      setPatientName("");
      setDoctorId("");

      await loadData();
    } catch {
      setError(
        "Booking failed. Please check FastAPI and MongoDB."
      );
    } finally {
      setLoading(false);
    }
  }

  function enterPortal(portal) {
    setActivePortal(portal);
    setPage("dashboard");
    setBooking(null);
  }

  function returnHome() {
    setActivePortal(null);
    setPatientSession(null);
    setPage("dashboard");
    setBooking(null);
  }

  const totalPatients = appointments.length;
  const totalDoctors = doctors.length;

  const averageWait = totalPatients
    ? Math.round(
        appointments.reduce(
          (sum, item) =>
            sum + (Number(item.waiting_time) || 0),
          0
        ) / totalPatients
      )
    : 0;

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === Number(doctorId)
  );

  const doctorQueue = appointments.filter(
    (item) => item.doctor_id === Number(doctorId)
  ).length;

  const navigation = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      id: "appointments",
      name: "Appointments",
      icon: <CalendarDays size={19} />,
    },
    {
      id: "doctors",
      name: "Doctors",
      icon: <Stethoscope size={19} />,
    },
    {
      id: "queue",
      name: "Queue Management",
      icon: <Clock3 size={19} />,
    },
  ];

  // Landing page
  if (activePortal === null) {
    return <LandingPage onEnterPortal={enterPortal} />;
  }

  // Patient registration and login
  if (activePortal === "patient" && !patientSession) {
    return (
      <PatientAuth
        onBack={returnHome}
        onSuccess={(data) => {
          setPatientSession(data);
          setPage("dashboard");
        }}
      />
    );
  }

  // Existing hospital dashboard
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✚</div>

          <div>
            <strong>MediQueue</strong>
            <small>HOSPITAL INTELLIGENCE</small>
          </div>
        </div>

        <div className="sidebar-label">
          WORKSPACE
        </div>

        <nav>
          {navigation.map((item) => (
            <button
              key={item.id}
              className={
                page === item.id
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setPage(item.id)}
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-icon">✦</div>

          <strong>Smarter patient care</strong>

          <p>
            Streamlining appointments and hospital queues.
          </p>

          <button
            className="outline-btn"
            onClick={returnHome}
            style={{ width: "100%" }}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          <div className="version">
            MediQueue · Version 1.0
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Hospital Workspace <span>/</span>

            <strong>
              {
                navigation.find(
                  (item) => item.id === page
                )?.name
              }
            </strong>
          </div>

          <div className="topbar-right">
            <span
              className={
                connected
                  ? "status online"
                  : "status offline"
              }
            >
              <span className="status-dot" />

              {connected
                ? "System Online"
                : "Disconnected"}
            </span>

            <div className="avatar">
              {activePortal === "patient"
                ? "PT"
                : activePortal === "doctor"
                ? "DR"
                : "AD"}
            </div>
          </div>
        </header>

        <main className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                HOSPITAL OPERATIONS
              </div>

              <h1>
                {page === "dashboard" &&
                  "Hospital Overview"}

                {page === "appointments" &&
                  "Appointments"}

                {page === "doctors" &&
                  "Doctor Directory"}

                {page === "queue" &&
                  "Queue Management"}
              </h1>

              <p>
                Manage appointments, monitor queues,
                and improve the patient experience.
              </p>
            </div>

            <button
              className="primary-btn heading-btn"
              onClick={() => setPage("appointments")}
            >
              + New Appointment
            </button>
          </div>

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          {page === "dashboard" && (
            <>
              <div className="stats-grid">
                <StatCard
                  label="Total Appointments"
                  value={totalPatients}
                  icon={<CalendarDays size={24} />}
                  color="blue"
                  detail="All recorded appointments"
                />

                <StatCard
                  label="Available Doctors"
                  value={totalDoctors}
                  icon={<Stethoscope size={24} />}
                  color="purple"
                  detail="Registered in the system"
                />

                <StatCard
                  label="Average Waiting Time"
                  value={`${averageWait} min`}
                  icon={<Clock3 size={24} />}
                  color="orange"
                  detail="Estimated average"
                />

                <StatCard
                  label="System Status"
                  value={connected ? "Active" : "Offline"}
                  icon={<Users size={24} />}
                  color="green"
                  detail="Backend connection"
                />
              </div>

              <div className="welcome-banner">
                <div>
                  <span className="banner-tag">
                    SMART HOSPITAL PLATFORM
                  </span>

                  <h2>
                    Better queues. Better care.
                  </h2>

                  <p>
                    Organize patient appointments and
                    provide transparent waiting-time
                    estimates from one centralized dashboard.
                  </p>

                  <button
                    onClick={() =>
                      setPage("appointments")
                    }
                  >
                    Book an Appointment →
                  </button>
                </div>

                <div className="banner-art">
                  <div className="art-circle">
                    <span>✚</span>
                  </div>
                </div>
              </div>

              <div className="section-heading">
                <h2>Recent Appointments</h2>

                <button
                  className="text-btn"
                  onClick={() => setPage("queue")}
                >
                  View all →
                </button>
              </div>

              <AppointmentTable
                appointments={appointments
                  .slice(-5)
                  .reverse()}
              />
            </>
          )}

          {page === "appointments" && (
            <div className="booking-layout">
              <section className="panel">
                <div className="panel-heading">
                  <div className="panel-icon">
                    <CalendarDays size={24} />
                  </div>

                  <div>
                    <h2>Book an Appointment</h2>

                    <p>
                      Enter patient and doctor information.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBooking}>
                  <label htmlFor="patient">
                    Patient Full Name
                  </label>

                  <input
                    id="patient"
                    type="text"
                    placeholder="e.g. Ananya Sharma"
                    value={patientName}
                    onChange={(event) =>
                      setPatientName(event.target.value)
                    }
                    required
                  />

                  <label htmlFor="doctor">
                    Select Doctor
                  </label>

                  <select
                    id="doctor"
                    value={doctorId}
                    onChange={(event) =>
                      setDoctorId(event.target.value)
                    }
                    required
                  >
                    <option value="">
                      Choose a doctor
                    </option>

                    {doctors.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.name} — {doctor.department}
                      </option>
                    ))}
                  </select>

                  <div className="form-info">
                    <Clock3
                      size={16}
                      style={{
                        verticalAlign: "middle",
                        marginRight: 8,
                      }}
                    />

                    {selectedDoctor
                      ? `Estimated wait: ${
                          doctorQueue *
                          selectedDoctor.avg_time
                        } minutes`
                      : "Select a doctor to view estimated wait"}
                  </div>

                  <button
                    type="submit"
                    className="primary-btn submit-btn"
                    disabled={loading || !connected}
                  >
                    {loading
                      ? "Booking Appointment..."
                      : "Confirm Appointment →"}
                  </button>
                </form>
              </section>

              <div className="booking-side">
                <div className="info-panel">
                  <div className="info-icon">✦</div>

                  <h3>
                    Effortless patient scheduling
                  </h3>

                  <p>
                    Our queue management system
                    automatically assigns queue numbers
                    and estimates waiting times based on
                    the selected doctor.
                  </p>
                </div>

                {booking && (
                  <div className="success-panel">
                    <span className="success-tag">
                      ✓ BOOKING CONFIRMED
                    </span>

                    <h2>
                      Appointment Successful!
                    </h2>

                    <p>{booking.patient_name}</p>
                    <p>{booking.doctor_name}</p>

                    <div className="booking-metrics">
                      <div>
                        <small>QUEUE NUMBER</small>

                        <strong>
                          {booking.queue_number}
                        </strong>
                      </div>

                      <div>
                        <small>ESTIMATED WAIT</small>

                        <strong>
                          {
                            booking.estimated_wait_minutes
                          }{" "}
                          min
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {page === "doctors" && (
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <div
                  className="doctor-card"
                  key={doctor.id}
                >
                  <div className="doctor-avatar">
                    <Stethoscope size={32} />
                  </div>

                  <h3>{doctor.name}</h3>
                  <p>{doctor.department}</p>

                  <div className="doctor-divider" />

                  <div className="doctor-detail">
                    <span>
                      Consultation Duration
                    </span>

                    <strong>
                      {doctor.avg_time} min
                    </strong>
                  </div>

                  <button
                    className="outline-btn"
                    onClick={() => {
                      setDoctorId(String(doctor.id));
                      setPage("appointments");
                    }}
                  >
                    Book Appointment →
                  </button>
                </div>
              ))}
            </div>
          )}

          {page === "queue" && (
            <>
              <div className="queue-summary">
                <div>
                  <span>
                    APPOINTMENT RECORDS
                  </span>

                  <h2>
                    {totalPatients} Patients
                  </h2>

                  <p>
                    All recorded hospital appointments
                  </p>
                </div>

                <button
                  className="outline-btn"
                  onClick={loadData}
                >
                  <RefreshCw
                    size={14}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 6,
                    }}
                  />
                  Refresh Queue
                </button>
              </div>

              <AppointmentTable
                appointments={appointments}
              />
            </>
          )}

          <div
            style={{
              marginTop: 30,
              textAlign: "center",
            }}
          >
            <button
              className="text-btn"
              onClick={returnHome}
            >
              <ArrowLeft
                size={14}
                style={{
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />
              Return to MediQueue Home
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  detail,
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>

      <p>{label}</p>
      <h2>{value}</h2>
      <small>{detail}</small>
    </div>
  );
}

function AppointmentTable({ appointments }) {
  return (
    <div className="table-panel">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>PATIENT NAME</th>
              <th>DOCTOR</th>
              <th>QUEUE NO.</th>
              <th>WAITING TIME</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="empty-state"
                >
                  No appointments yet. Book your
                  first appointment.
                </td>
              </tr>
            ) : (
              appointments.map((item, index) => (
                <tr key={index}>
                  <td>
                    <strong>
                      {item.patient_name}
                    </strong>
                  </td>

                  <td>
                    {item.doctor_name}
                  </td>

                  <td>
                    <span className="queue-badge">
                      {item.queue_number}
                    </span>
                  </td>

                  <td>
                    {item.waiting_time ?? 0} min
                  </td>

                  <td>
                    <span className="pending-badge">
                      Booked
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
