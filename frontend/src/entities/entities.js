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

export const Projectile_Point = {
    _id:"",
    image:"",
    description:"",
    culture_id:"",
    period_id:"",
    material_id:"",
    site_id:"",
    blade_shape:"",
    base_shape:"",
    hafting_shape:"",
    cross_section:"",
    location:"",
    dimensions:[]
}

//TODO: Use these in dropdowns for the point model
export const blade_shapes = ["triangular","excurvate","incurvate","ovate","indeterminate"];
export const base_shapes = ["straight","concave","convex","indeterminate"];
export const hafting_shapes =["lanceolate","stemmed","basally concave","expanding","contracting",
    "corner-notched","side-notched","basal-notched","triangular un-notched","indeterminate"] ;
export const cross_section = ["rhomboid","lenticular","plano-convex","fluted","median-ridged","flat","indeterminate"];
