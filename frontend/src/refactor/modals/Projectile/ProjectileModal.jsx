import EditCreateModal from "../EditCreateModal.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography
} from "@mui/material";
import React from "react";
import {
    ArtifactImage,
    BladeDetails,
    DimensionDetails,
    LocationDetails,
    MaterialSelector, NoteArea,
    PeriodCultureSelector
} from "./ProjectileAttributes.jsx";
import http, {http_custom} from "../../../../http.js";


/**
 * TODO: Comment & Cleanup
 */
class ProjectileModal extends EditCreateModal{

    constructor(props) {
        super(props);
        this.state.entity = {
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

        //Prefilled values
        this.state.periods = [];
        this.state.cultures = [];
        this.state.base_shapes = [];

        //Selector Name holders
        this.state.selected_period = "";
        this.state.selected_culture = "";

        //Image needs
        this.state.img_payload = {};
        this.state.loaded = false;
    }

    componentDidMount(){
        super.componentDidMount();
        if(this.props.adding_new){
            this.update_entity("site_id",this.props.site_id)
            this.setState({title:`${this.props.site_name}/**NEW**`});
        }else{
            this.setState({title:`${this.props.site_name}/${this.props.entity._id}`,loaded:true});
            //we need to assign culture/period/material based on id's.
            /* TODO: If we fetch these in the parent and pass as parameters we
               bigtime save on reqs... but i see we have chosen the dark side...*/
        }
    }


    /**
     * Generates the region containing
     * - Dimensions
     * - Material
     */
    specs_area(){
        return(
                <Grid item s={5}>
                    <Typography sx={{mt: 2}} varient="h6">
                        Dimensions: {this.state.entity.dimensions.filter(x => x > 0).join("mm X ")}
                    </Typography>
                    <Typography sx={{mt: 2}}
                                varient="h6">Material: {this.state.entity.material_id}</Typography>
                </Grid>
            )
    }

    get_material_id(){
        return this.state.entity.material_id ?? "";
    }

    render_fields() {
        console.log(`FYI State: ${JSON.stringify(this.state.entity)}`);
        return(
            <Grid container spacing={2}>
                <ArtifactImage
                    update_image={(img) => this.setState({img_payload:img})}
                />
                {/*{this.title_area()}*/}
                <PeriodCultureSelector
                    update_entity={(k,v) => this.update_entity(k,v)}
                    culture_id={this.state.entity.culture_id}
                    period_id={this.state.entity.period_id}
                />
                <Grid item s={5}>
                    <DimensionDetails
                        update_entity={(k,v) => this.update_entity(k,v)}
                        value={this.state.entity.dimensions}/>
                    <MaterialSelector
                        value = {this.state.entity.material_id ?? ""}
                        update_entity = {(k,v) => this.update_entity(k,v)}
                    />
                </Grid>
                <BladeDetails
                    base_shape={this.state.entity.base_shape}
                    blade_shape={this.state.entity.blade_shape}
                    hafting_shape={this.state.entity.hafting_shape}
                    cross_section={this.state.entity.cross_section}
                    update_entity = {(k,v) => this.update_entity(k,v)}
                />
                <NoteArea
                    update_entity={(k,v) => this.update_entity(k,v)}
                    value={this.state.entity.description}/>
                <LocationDetails update_entity={(k,v) => this.update_entity(k,v)}/>
            </Grid>
        )
    }

    /**
     * TODO
     * @return {boolean}
     */
    validate() {
        return true;
    }

    async upload_photo(site_id,point_id){
        let upload_url = `/sites/${site_id}/upload/${point_id}`
        let payload = this.state.img_payload;
        console.log(`FORM DATA IS:`,payload)
        let headers = {'Content-Type':"multipart/form-data"}

        return http_custom(headers).post(upload_url,payload)
            .catch(err => console.error("FAILEd TO ADD IMAGE",err))
    }

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
                        .finally(() => console.log("image added (allegedly)"))

                }).catch(err => {
                    console.error(`Failed to add point:`,err);
                    this.props.send_alert({open:true,type:"error",message:`Failed to add new Poit`})
                })
                .then(this.props.send_alert({open:true,type:"success",message:`Successfully added new Point!`}))
                .finally(this.props.on_close)
        } else {
            console.error(`${this.props.subject} Invalid!: ${JSON.stringify(add_me)}`)
            this.props.send_alert({open: true, type: "error", message: `Failed to add new ${this.props.subject}.`})
        }


    }

    render() {
        return(
            <div>
                {this.state.loaded ?
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                maxWidth="md"
                >
                <DialogTitle>{this.state.title} {this.props.subject}: {this.state.entity.name}</DialogTitle>
                <DialogContent>
                    {this.render_fields()}
                <DialogActions>
                    <Button onClick={this.props.on_close} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handle_submit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </DialogContent>
            </Dialog>:<h1>Loading...</h1>}
            </div>
        )
    }
}
export default ProjectileModal;