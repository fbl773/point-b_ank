/* Entities - objects representative of DB entities*/


/**
 * The Region type as exists in DB
 * @type {{name: string, description: string, _id: string}}
 */
export const Region = {
    _id:"",
    name:"",
    description:""
}

/**
 * Material type as exists in DB
 * @type {{artifact_type: string, name: string, _id: string}}
 */
export const Material= {
    _id:"",
    name:"",
    artifact_type:""
}

/**
 * Site as exists in DB
 * @type {{catalogue_id: string, name: string, region_id: string, description: string, location: string, _id: string}}
 */
export const SiteEntity = {
    "_id":"",
    name:"",
    description:"",
    location:"",
    catalogue_id:"",
    region_id:"",
}
