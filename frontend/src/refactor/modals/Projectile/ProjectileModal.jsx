import EditCreateModal from "../EditCreateModal.jsx";
import React from "react";
import {
    ArtifactImage,
    BladeDetails,
    DimensionDetails,
    LocationDetails,
    MaterialSelector, NoteArea,
    PeriodCultureSelector
} from "./ProjectileAttributes.jsx";
import http, {http_custom,baseURL} from "../../../../http.js";
import { Stack } from "@mui/system";


/**
 * The epic modal to edit/create a projectile point
 */
class ProjectileModal extends EditCreateModal{

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            entity: {
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
                dimensions:[0,0,0]
        }
    }

        //Image needs
        this.state.img_payload = {};

    }

    /**
     * Additionally set the modal title and also site_id if adding new
     */
    componentDidMount(){
        super.componentDidMount();
        if(this.props.adding_new){
            this.update_entity("site_id",this.props.site_id)
            this.setState({title:`${this.props.site_name}/NEW`});
        }else{
            this.setState({title:`${this.props.site_name}/${this.props.entity._id}`,loaded:true});
        }
    }


    /**
     * Ensures that a projectile point meets the minimum definition of:
     * *
     * @return {boolean}
     */
    validate() {
        const checks = [
            this.state.description
        ]
        return true
    }

    /**
     * Renders the modal with the appropriate sub-components
     * @return {Element}
     */
    render_fields() {
        return(
            <Stack spacing={2} paddingTop={2}>
                <Stack direction='row' width='100%' spacing={2} >
                    <PeriodCultureSelector
                        update_entity={(k,v) => this.update_entity(k,v)}
                        culture_id={this.state.entity.culture_id}
                        period_id={this.state.entity.period_id}
                    />
                    <NoteArea
                        update_entity={(k,v,e) => this.update_entity(k,v,e)}
                        value={this.state.entity.description}/>
                </Stack>
                <LocationDetails
                    location={this.state.entity.location}
                    update_entity={(k,v) => this.update_entity(k,v)}
                />
                <MaterialSelector
                    value = {this.state.entity.material_id ?? ""}
                    update_entity = {(k,v) => this.update_entity(k,v)}
                />
                <Stack width='100%' spacing={2}>
                    <Stack direction='row' spacing={2} >
                        <BladeDetails
                            base_shape={this.state.entity.base_shape}
                            blade_shape={this.state.entity.blade_shape}
                            hafting_shape={this.state.entity.hafting_shape}
                            cross_section={this.state.entity.cross_section}
                            update_entity = {(k,v) => this.update_entity(k,v)}
                        />
                        <ArtifactImage
                            update_image={(img) => this.setState({img_payload:img})}
                            update_entity={(k,v) => this.update_entity(k,v)}
                            artifact_id={this.state.entity._id}
                            site_id={this.state.entity.site_id}
                            hostname={baseURL}
                            img_name={this.state.entity.image}
                        />
                    </Stack>
                    <DimensionDetails
                        update_entity={(k,v) => this.update_entity(k,v)}
                        value={this.state.entity.dimensions}/>
                </Stack>

            </Stack>
        )
    }

    /**
     * Uploads the photo assoicated with this artifact to the server.
     * @param site_id - the ID of the site the point belongs to
     * @param point_id - the points unique ID
     * @return {Promise<axios.AxiosResponse<any>|void|null>}
     */
    async upload_photo(site_id,point_id){
        if(this.state.img_payload !== undefined) {
            let upload_url = `/sites/${site_id}/upload/${point_id}`
            let payload = this.state.img_payload;
            let headers = {'Content-Type': "multipart/form-data"}

            return http_custom(headers).post(upload_url, payload)
                .catch((err) => {
					console.error("FAILED TO ADD IMAGE", err);
                    this.send_alert({open:true, type:"error", message:`Failed to add image`});
					})
        	} else {
            return null;
        }
    }

    /**
     * Edits the passed eintity as in the base class but additionally
     * handles a photo upload request
     * TODO: Add error message capabilities
     * @return {Promise<void>}
     */
    async edit_entity(){
        let edit_me = this.state.entity;
        edit_me.image = this.state.img_payload == null ? "": this.state.entity.image;

        this.setState({entity:edit_me}, () => {
            super.edit_entity()
                .then(() => {
                    if(edit_me.image)
                        this.upload_photo(this.props.site_id,edit_me._id)
                })
        })
    }

    /**
     * Adds a new entity as in the base class but additionally
     * handles photo upload by first creating the new entity, then using the
     * resulting ID to build the photo's path.
     * @return {Promise<void>}
     */
    async add_entity() {
        //Then go in for the photo? Yep. We will need the ID from our new entity. this is a full override
        let add_me = this.state.entity;
        delete add_me._id;
        if(add_me.material_id === ""){
            delete add_me.material_id
        }
        if(this.validate()){
            http.post(this.props.url,add_me)
                .then(resp => {
                    let new_point = resp.data.new_ent;
                    this.append_new(new_point);
                    this.upload_photo(this.props.site_id,new_point._id)
                }).catch(err => {
                    console.error(`Failed to add point:`,err);
                    this.send_alert({open:true,type:"error",message:`Failed to add new Point`})
                })
                .then(this.send_alert({open:true,type:"success",message:`Successfully added new Point!`}))
				.finally(this.props.on_close)
        } else {
            console.error(`${this.props.subject} Invalid!: ${JSON.stringify(add_me)}`)
            this.send_alert({open: true, type: "error", message: `Failed to add new ${this.props.subject}.`})
        }

    }

}
export default ProjectileModal;
