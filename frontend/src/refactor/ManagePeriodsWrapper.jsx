import {useContext} from "react";
import {UserContext} from "../context/userContext.jsx";
import ManagePeriod from "./ManagePeriod.jsx";

export default function ManagePeriodsWrapper() {

    const { user } = useContext(UserContext);
    return(
        <ManagePeriod
            url={"/periods"}
            subject={"Period"}
            context={user}
        />
    )
}