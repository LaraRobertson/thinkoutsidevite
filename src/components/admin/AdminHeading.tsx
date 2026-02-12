import {useState} from "react";
import {NavLink} from 'react-router-dom';
import HomeIcon from "../../assets/icons/noun-home-7100601.svg?react";
import DashBoardIcon from "../../assets/icons/noun-dashboard-7064012.svg?react";
import GameIcon from "../../assets/icons/noun-tactics-6452991.svg?react";
import UserIcon from "../../assets/icons/noun-user-1994976.svg?react";

export default function AdminHeading(props: {userName: string}) {
    const [routeSelection, setRouteSelection] = useState({section:"dashboard"})
    console.log("props.userName: " + props);
    return (
        <div className={"header"}>
            <h4 className={"admin-content-header"} >Welcome {props.userName}!</h4>
            <div className={"admin-content-header-nav"}>
                <NavLink to="/admin" className={(routeSelection.section === "dashboard") ? "admin-nav-icon-border flex-parent-center" : "flex-parent-center"} onClick={() => {setRouteSelection({section: "dashboard"})}}>
                    <DashBoardIcon  width={35} height={35} />
                </NavLink>
                <NavLink to="/admin/games" className={(routeSelection.section === "games") ? "admin-nav-icon-border flex-parent-center" : "flex-parent-center"} onClick={() => {setRouteSelection({section: "games"})}}>
                    <GameIcon  width={35} height={35} />
                </NavLink>
                <NavLink to="/admin/users" className={(routeSelection.section === "users") ? "admin-nav-icon-border flex-parent-center" : "flex-parent-center"} onClick={() => {setRouteSelection({section: "users"})}}>
                    <UserIcon  width={35} height={35} />
                </NavLink>
                <NavLink to="/" className= "flex-parent-center">
                    <HomeIcon  width={35} height={35} />
                </NavLink>
            </div>
        </div>
    )
}