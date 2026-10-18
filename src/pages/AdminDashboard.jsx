import { useEffect, useState } from "react";
import "../sass/AdminDashboard.scss";
import MediaManagement from "../components/AdminDashboard/MediaManagement";
import ContentManagement from "../components/AdminDashboard/ContentManagement";
import FlourishText from "../components/Snippets/FlourishText";
import ContactRequestsManagement from "../components/AdminDashboard/ContactRequestsManagement";
import RepertoireManagement from "../components/AdminDashboard/RepertoireManagement";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

function AdminDashboard() {
    const [activeNav, setActiveNav] = useState('content');
    // Zahl ungelesener Kontaktanfragen für den Tab
    const [newRequests, setNewRequests] = useState(0);
    const token = useAuthStore((state) => state.getToken());

    useEffect(() => {
        axios.get('/api/admin/contact-requests', { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setNewRequests((res.data.data || []).filter((r) => r.status === 'new').length))
            .catch(() => {});
    }, []);

    const adminNavs = [
        {
            title: 'Content',
            value: 'content',
            element: <ContentManagement />,
        },
        {
            title: 'Medien',
            value: 'images',
            element: <MediaManagement />,
        },
        {
            title: 'Anfragen',
            value: 'requests',
            badge: newRequests,
            element: <ContactRequestsManagement onNewCountChange={setNewRequests} />,
        },
        {
            title: 'Repertoire',
            value: 'repertoire',
            element: <RepertoireManagement />,
        },
    ];

    const navElements = (adminNavs || []).map((nav, index) => (
        <li 
            key={index} 
            value={nav.value} 
            onClick={() => setActiveNav(nav.value)} // Direkt den Wert setzen
            className={activeNav === nav.value ? 'active' : ''}
        >
            {nav.title}
            {nav.badge > 0 && <span className="dashboard-tab-badge" aria-label={`${nav.badge} ungelesen`}>{nav.badge}</span>}
        </li>
    ));

    // Finde das aktuelle Element basierend auf der aktiven Navigation
    const currentElement = adminNavs.find(nav => nav.value === activeNav)?.element;

    return (
        <div id="admin-dashboard">
            <h2><FlourishText>Admin Dashboard</FlourishText></h2>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <ul>
                        {navElements}
                    </ul>
                </div>
                <div className="dashboard-content">
                    {currentElement} {/* Zeige den Inhalt basierend auf der aktiven Navigation */}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
