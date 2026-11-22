
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarCheck,
  ChevronRight,
  Clock3,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
  Send,
} from "lucide-react";
import "./LandingPage.css";

const portals = [
  {
    id: "patient",
    title: "Patient Portal",
    subtitle: "YOUR HEALTH, SIMPLIFIED",
    description:
      "Book consultations, track your live queue position, and stay informed with intelligent waiting-time estimates.",
    icon: HeartPulse,
    accent: "pink",
    features: ["Easy appointments", "Live queue tracking"],
  },
  {
    id: "doctor",
    title: "Doctor Portal",
    subtitle: "FOCUS ON WHAT MATTERS",
    description:
      "Manage consultations, view upcoming patients, and keep your daily schedule running smoothly.",
    icon: Stethoscope,
    accent: "teal",
    features: ["Patient queue", "Consultation management"],
  },
  {
    id: "admin",
    title: "Administrator Portal",
    subtitle: "COMPLETE HOSPITAL CONTROL",
    description:
      "Oversee hospital operations, monitor patient flow, and make smarter decisions with actionable insights.",
    icon: LayoutDashboard,
    accent: "purple",
    features: ["Hospital analytics", "Queue management"],
  },
];

function LandingPage({ onEnterPortal = () => {} }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Welcome to MediQueue. I can help you find the right portal and explain how our queue system works.",
    },
  ]);

  function sendMessage(event) {
    event.preventDefault();
    const question = message.trim();
    if (!question) return;

    setMessages((previous) => [
      ...previous,
      { sender: "user", text: question },
      {
        sender: "bot",
        text: "Thanks for your question! Our full AI assistant is coming soon. For now, choose a portal to explore MediQueue.",
      },
    ]);
    setMessage("");
  }

  return (
    <div className="landing">
      <div className="landing-glow landing-glow-one" />
      <div className="landing-glow landing-glow-two" />

      <header className="landing-navbar">
        <a className="landing-logo" href="#home">
          <span className="landing-logo-icon">
            <Activity size={24} strokeWidth={2.8} />
          </span>
          <span>
            <strong>MediQueue</strong>
            <small>SMART HOSPITAL PLATFORM</small>
          </span>
        </a>

        <nav className="landing-nav">
          <a href="#home">Home</a>
          <a href="#portals">Our Portals</a>
          <a href="#features">Features</a>
        </nav>

        <button
          className="landing-nav-button"
          onClick={() => onEnterPortal("patient")}
        >
          Get Started <ArrowRight size={16} />
        </button>
      </header>

      <main id="home">
        <section className="landing-hero">
          <div className="landing-pill">
            <Sparkles size={14} />
            THE FUTURE OF HOSPITAL QUEUE MANAGEMENT
          </div>

          <h1>
            Smart Hospital
            <br />
            <span>Queue Mastery.</span>
          </h1>

          <p className="landing-hero-description">
            A smarter way to connect patients, doctors, and hospital teams.
            Experience seamless appointments, transparent queues, and
            intelligent healthcare management — all in one place.
          </p>

          <div className="landing-hero-actions">
            <a href="#portals" className="landing-main-button">
              Explore Your Portal <ArrowRight size={18} />
            </a>
            <a href="#features" className="landing-secondary-button">
              Discover Features <ChevronRight size={18} />
            </a>
          </div>

          <div className="landing-trust">
            <span><ShieldCheck size={16} /> Organized care</span>
            <span><Clock3 size={16} /> Smarter waiting</span>
            <span><HeartPulse size={16} /> Patient focused</span>
          </div>
        </section>

        <section className="landing-portals" id="portals">
          <div className="landing-section-heading">
            <span className="landing-section-label">ONE PLATFORM. THREE EXPERIENCES.</span>
            <h2>Choose your <span>workspace.</span></h2>
            <p>
              Every role has its own dedicated space, designed to make
              healthcare operations effortless.
            </p>
          </div>

          <div className="landing-portal-grid">
            {portals.map((portal) => {
              const Icon = portal.icon;

              return (
                <article
                  className={`landing-portal-card ${portal.accent}`}
                  key={portal.id}
                >
                  <div className="landing-card-top">
                    <div className="landing-portal-icon">
                      <Icon size={29} strokeWidth={1.8} />
                    </div>
                    <span className="landing-card-arrow">
                      <ArrowRight size={20} />
                    </span>
                  </div>

                  <div className="landing-card-subtitle">{portal.subtitle}</div>
                  <h3>{portal.title}</h3>
                  <p>{portal.description}</p>

                  <div className="landing-card-features">
                    {portal.features.map((feature) => (
                      <span key={feature}>
                        <span className="landing-feature-dot" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  <button
                    className="landing-portal-button"
                    onClick={() => onEnterPortal(portal.id)}
                  >
                    Enter {portal.title}
                    <ArrowRight size={17} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-features" id="features">
          <div className="landing-section-heading">
            <span className="landing-section-label">BUILT FOR BETTER CARE</span>
            <h2>Intelligent by <span>design.</span></h2>
          </div>

          <div className="landing-feature-grid">
            <div>
              <CalendarCheck size={25} />
              <h3>Effortless Booking</h3>
              <p>Schedule consultations through a simple digital experience.</p>
            </div>
            <div>
              <Clock3 size={25} />
              <h3>Queue Visibility</h3>
              <p>Stay informed with queue positions and waiting-time estimates.</p>
            </div>
            <div>
              <Users size={25} />
              <h3>Connected Teams</h3>
              <p>Bring patients, doctors, and administrators into one system.</p>
            </div>
            <div>
              <Bot size={25} />
              <h3>AI Assistance</h3>
              <p>Get convenient guidance through our upcoming smart assistant.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <strong>✚ MediQueue</strong>
        <span>Smarter queues. Better care.</span>
        <small>© {new Date().getFullYear()} MediQueue</small>
      </footer>

      <div className="landing-chatbot">
        {chatOpen && (
          <div className="landing-chat-window">
            <div className="landing-chat-header">
              <div className="landing-chat-avatar">
                <Bot size={22} />
              </div>
              <div>
                <strong>MediQueue Assistant</strong>
                <small>Portal guidance · Preview</small>
              </div>
              <button
                aria-label="Close chatbot"
                onClick={() => setChatOpen(false)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="landing-chat-messages">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`landing-chat-message ${item.sender}`}
                >
                  {item.text}
                </div>
              ))}
            </div>

            <form className="landing-chat-form" onSubmit={sendMessage}>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask MediQueue..."
                aria-label="Chat message"
              />
              <button type="submit" aria-label="Send message">
                <Send size={17} />
              </button>
            </form>
          </div>
        )}

        <button
          className="landing-chat-toggle"
          onClick={() => setChatOpen(!chatOpen)}
          aria-label={chatOpen ? "Close chatbot" : "Open chatbot"}
        >
          {chatOpen ? <X size={25} /> : <MessageCircle size={26} />}
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
