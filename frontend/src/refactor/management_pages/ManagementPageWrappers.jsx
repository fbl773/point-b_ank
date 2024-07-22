import {useContext} from "react";
import {UserContext} from "../../context/userContext.jsx";
import ManagePeriod from "./ManagePeriod.jsx";
import ManageCulture from "./ManageCultures.jsx";

export function ManagePeriodWrapper() {
    const { user } = useContext(UserContext);
    return(
        <ManagePeriod
            url={"/periods"}
            subject={"Period"}
            context={user}
        />
    )
}

export function ManageCultureWrapper(){
    const { user } = useContext(UserContext);
    return(
        <ManageCulture
            url={"/cultures"}
            subject={"Culture"}
            context={user}
        />
    )
}