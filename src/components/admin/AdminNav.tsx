import {Button, Heading, Image, Flex} from "@aws-amplify/ui-react";
import React, {useState} from "react";
import {NavLink, useNavigate} from 'react-router-dom';
import LeftArrow from "../../assets/left-arrow-svgrepo-com.svg?react";
import RightArrow from "../../assets/right-arrow-svgrepo-com.svg?react";
import HomeIcon from "../../assets/noun-home-7100601.svg?react";
import DashBoardIcon from "../../assets/noun-dashboard-7064012.svg?react";
import GameIcon from "../../assets/noun-tactics-6452991.svg?react";
import UserIcon from "../../assets/noun-user-1994976.svg?react";

export default function AdminNav(props: {displaySection: string; setDisplaySection: (section: string) => void}) {

    const [routeSelection, setRouteSelection] = useState({section:"dashboard"})
    const [sidebarDisplay, setSideBarDisplay] = useState(true);
    function closeSideBar() {
        setSideBarDisplay(!sidebarDisplay);
    }
    return (
        <div id="adminNavBar" className={sidebarDisplay? "admin-nav-open" : "admin-nav-closed"}>
            <div className={"header"}><h1>Admin</h1></div>
            <div style={{padding: ".5rem 0"}}>
                <NavLink to="/admin" className={(routeSelection.section === "dashboard") ? "admin-nav-icon-border flex-parent-left" : "flex-parent-left"} onClick={() => {setRouteSelection({section: "dashboard"})}}>
                    <DashBoardIcon  width={35} height={35} /> <div className={sidebarDisplay? "show-inline admin-nav-link " : "hide"}>Dashboard</div>
                </NavLink>
                <NavLink to="/admin/games" className={(routeSelection.section === "games") ? "admin-nav-icon-border flex-parent-left" : "flex-parent-left"} onClick={() => {setRouteSelection({section: "games"})}}>
                    <GameIcon  width={35} height={35} /> <div className={sidebarDisplay? "show-inline admin-nav-link " : "hide"}>Games</div>
                </NavLink>
                <NavLink to="/admin/users" className={(routeSelection.section === "users") ? "admin-nav-icon-border flex-parent-left" : "flex-parent-left"} onClick={() => {setRouteSelection({section: "users"})}}>
                    <UserIcon  width={35} height={35} /> <div className={sidebarDisplay? "show-inline admin-nav-link " : "hide"}>Users</div>
                </NavLink>
                <NavLink to="/" className= "flex-parent-left">
                    <HomeIcon  width={35} height={35} />
                </NavLink>

                <div className={sidebarDisplay? "sider-trigger-open" : "sider-trigger-closed"}>
                    <button className={"admin-button-transparent"} onClick={closeSideBar}>
                        {sidebarDisplay? <LeftArrow height={20} width={20} /> :
                            <RightArrow height={20} width={20} />}
                    </button>
                </div>
            </div>

        </div>
    )
}