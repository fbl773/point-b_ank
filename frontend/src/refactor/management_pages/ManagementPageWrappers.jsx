import {useContext} from "react";
import {UserContext} from "../../context/userContext.jsx";
import ManagePeriod from "./ManagePeriod.jsx";
import ManageCulture from "./ManageCultures.jsx";
import ManageMaterials from "./ManageMaterials.jsx";

/**
* Wraps the <T> Managing component in a function such that we can 
* use their "context" feature. It is silly, but the cost of an object-y
* refactor is pretty high. This is a reasonable alternative methinks. 
*/
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
