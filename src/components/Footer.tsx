import NavContainer from "./NavContainer.tsx";
type FooterProps = {
  signOut: () => void;
  hideNav?: boolean;
};

export default function Footer({signOut, hideNav}: FooterProps) {

    return (
        <footer className={hideNav? "hide" : ""}>
            <NavContainer signOut={signOut} footer={true}/>
            <div className={"copyright"}>© 2026 ThinkOutsideGames. All rights reserved.</div>
        </footer>
    )
}