import NavContainer from "./NavContainer.tsx";

type TopNavProps = {
  signOut: () => void;
  hideNav?: boolean;
};

export default function TopNav({signOut,hideNav}: TopNavProps) {

    return (
        <header className={hideNav? "hide" : ""}>
           <NavContainer signOut={signOut} footer={false}/>
        </header>
    )
}