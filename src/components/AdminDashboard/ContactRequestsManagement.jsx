import { useState, useEffect } from "react";
import axios from "axios";
import { FaReply, FaTrash, FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import "../../sass/ContactRequests.scss";

const STATUS_LABELS = { new: "Neu", read: "Gelesen", answered: "Beantwortet" };
const FILTERS = [
  { key: "all", label: "Alle" },
  { key: "new", label: "Neu" },
  { key: "read", label: "Gelesen" },
  { key: "answered", label: "Beantwortet" },
];

const formatDate = (value) =>
  new Date(value).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });

/** Antwort im eigenen Mailprogramm: Empfänger, Betreff und zitierte Nachricht sind schon ausgefüllt */
function replyLink(request) {
  const quoted = request.message.split("\n").map((line) => `> ${line}`).join("\n");
  const body = `Hallo ${request.name},\n\nvielen Dank für deine Nachricht!\n\n\n\nViele Grüße\nJody Cooper & the Wonders\n\n— Deine Nachricht vom ${formatDate(request.createdAt)} —\n${quoted}`;
  const subject = "Deine Anfrage an Jody Cooper & the Wonders";
  return `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Übersicht der Anfragen aus dem Kontaktformular: lesen, beantworten, Status setzen, löschen
function ContactRequestsManagement({ onNewCountChange = () => {} }) {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = useAuthStore((state) => state.getToken());
  const showNotification = useNotificationStore((state) => state.showNotification);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    onNewCountChange(requests.filter((r) => r.status === "new").length);
  }, [requests]);

  async function fetchRequests() {
    try {
      const res = await axios.get("/api/admin/contact-requests", { headers });
      setRequests(res.data.data || []);
    } catch (error) {
      console.error("Fehler beim Laden der Anfragen:", error);
      showNotification("Anfragen konnten nicht geladen werden", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function setStatus(request, status, { silent = false } = {}) {
    if (request.status === status) return;
    try {
      const res = await axios.patch(`/api/admin/contact-requests/${request.id}`, { status }, { headers });
      setRequests((list) => list.map((r) => (r.id === request.id ? res.data.data : r)));
      if (!silent) showNotification(`Als „${STATUS_LABELS[status]}“ markiert`, "success");
    } catch (error) {
      console.error("Fehler beim Ändern des Status:", error);
      showNotification("Status konnte nicht geändert werden", "error");
    }
  }

  async function deleteRequest(request) {
    if (!window.confirm(`Anfrage von ${request.name} endgültig löschen?`)) return;
    try {
      await axios.delete(`/api/admin/contact-requests/${request.id}`, { headers });
      setRequests((list) => list.filter((r) => r.id !== request.id));
      showNotification("Anfrage gelöscht", "success");
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      showNotification("Anfrage konnte nicht gelöscht werden", "error");
    }
  }

  function toggleOpen(request) {
    const opening = openId !== request.id;
    setOpenId(opening ? request.id : null);
    // Öffnen einer neuen Anfrage gilt als gelesen
    if (opening && request.status === "new") setStatus(request, "read", { silent: true });
  }

  const counts = Object.fromEntries(FILTERS.map(({ key }) => [
    key,
    key === "all" ? requests.length : requests.filter((r) => r.status === key).length,
  ]));
  const visible = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  if (isLoading) return <div>Lade Anfragen …</div>;

  return (
    <div id="contact-requests">
      <div className="requests-toolbar">
        <div className="requests-filter" role="tablist" aria-label="Anfragen filtern">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={filter === key ? "active" : ""}
              onClick={() => setFilter(key)}
            >
              {label} <span className="count">{counts[key]}</span>
            </button>
          ))}
        </div>
        <button type="button" className="admin-btn btn-secondary" onClick={fetchRequests}>Aktualisieren</button>
      </div>

      {visible.length === 0 && (
        <p className="requests-empty">
          {requests.length === 0
            ? "Noch keine Anfragen. Nachrichten aus dem Kontaktformular erscheinen hier."
            : "Keine Anfragen in dieser Ansicht."}
        </p>
      )}

      <ul className="requests-list">
        {visible.map((request) => {
          const isOpen = openId === request.id;
          return (
            <li key={request.id} className={`request status-${request.status}${isOpen ? " open" : ""}`}>
              <button
                type="button"
                className="request-summary"
                onClick={() => toggleOpen(request)}
                aria-expanded={isOpen}
              >
                <span className="request-status">{STATUS_LABELS[request.status]}</span>
                <span className="request-from">
                  <span className="request-name">{request.name}</span>
                  <span className="request-email">{request.email}</span>
                </span>
                <span className="request-preview">{request.message}</span>
                <time className="request-date" dateTime={request.createdAt}>{formatDate(request.createdAt)}</time>
              </button>

              {isOpen && (
                <div className="request-body">
                  <p className="request-message">{request.message}</p>
                  {request.answeredAt && (
                    <p className="request-answered">Beantwortet am {formatDate(request.answeredAt)}</p>
                  )}

                  <div className="request-actions">
                    <a
                      className="admin-btn btn-primary"
                      href={replyLink(request)}
                      onClick={() => setStatus(request, "answered", { silent: true })}
                    >
                      <FaReply /> Antworten
                    </a>
                    {request.status !== "answered" && (
                      <button type="button" className="admin-btn btn-secondary" onClick={() => setStatus(request, "answered")}>
                        Als beantwortet markieren
                      </button>
                    )}
                    {request.status === "new" ? (
                      <button type="button" className="admin-btn btn-secondary" onClick={() => setStatus(request, "read")}>
                        <FaEnvelopeOpen /> Als gelesen markieren
                      </button>
                    ) : (
                      <button type="button" className="admin-btn btn-secondary" onClick={() => setStatus(request, "new")}>
                        <FaEnvelope /> Als ungelesen markieren
                      </button>
                    )}
                    <button type="button" className="admin-btn btn-danger" onClick={() => deleteRequest(request)}>
                      <FaTrash /> Löschen
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ContactRequestsManagement;
