import { UserContext } from "../../context/userContext.jsx";

export function ListProjectilesWrapper(){
    const {user} = useContext(UserContext);
    return(
        <ProjectileList
            context={user}
        />
    )
}