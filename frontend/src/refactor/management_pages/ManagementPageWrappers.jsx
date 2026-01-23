import {useContext} from "react";
import {UserContext} from "../../context/userContext.jsx";
import ManagePeriod from "./ManagePeriod.jsx";
import ManageCulture from "./ManageCultures.jsx";
import ManageMaterials from "./ManageMaterials.jsx";
import http from "../../../http.js";

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

export function ManageMaterialsWrapper(){
    const { user } = useContext(UserContext);
    return(
        <ManageMaterials
            url={"/materials"}
            subject={"Material"}
            context={user}
        />
    )
}