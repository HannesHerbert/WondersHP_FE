import { useEffect, useState } from "react";
import "../sass/AdminDashboard.scss";
import MembersManagement from "../components/AdminDashboard/MembersManagement";
import MediaManagement from "../components/AdminDashboard/MediaManagement";

function AdminDashboard() {
    const [activeNav, setActiveNav] = useState('members');

    const adminNavs = [
        {
            title: 'Mitglieder',
            value: 'members',
            element: <MembersManagement />,
        },
        {
            title: 'Bilder/Videos',
            value: 'images',
            element: <MediaManagement />,
        },
        {
            title: 'Band',
            value: 'band',
            element: <div>Inhalt für Band</div>,
        },
        {
            title: 'Songliste',
            value: 'songs',
            element: <div>Inhalt für Songliste</div>
        },
    ];

    // useEffect(() => {
    //     console.log(activeNav);
    // }, [activeNav]);

    const navElements = adminNavs.map((nav, index) => (
        <li 
            key={index} 
            value={nav.value} 
            onClick={() => setActiveNav(nav.value)} // Direkt den Wert setzen
            className={activeNav === nav.value ? 'active' : ''}
        >
            {nav.title}
        </li>
    ));

    // Finde das aktuelle Element basierend auf der aktiven Navigation
    const currentElement = adminNavs.find(nav => nav.value === activeNav)?.element;

    return (
        <div id="admin-dashboard">
            <h2>Admin Dashboard</h2>
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
