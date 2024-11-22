import EditCreateModal from "../EditCreateModal.jsx";
import http from "../../../../http.js";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl,
    Grid, InputLabel, MenuItem, Select, TextareaAutosize,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {blade_shapes,base_shapes,hafting_shapes,cross_sections} from "../../../entities/entities.js"
import React from "react";
import {
    BladeDetails,
    DimensionDetails,
    LocationDetails,
    MaterialSelector, NoteArea,
    PeriodCultureSelector
} from "./ProjectileAttributes.jsx";

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
    }

    componentDidMount(){
        super.componentDidMount();

        //Set title
        this.setState({title:`${this.props.site_name}/${this.state.entity._id ?? "*New*"}`})

    }


    /**
     * Generates the area associated with the image collection
     */
    image_area(){
        return(
            <Grid item xs={7} >
                <img
                    src={"/src/assets/DC_AH-4F.JPG"}
                    style={{maxWidth: "100%"}}
                    alt="POINT"/>
            </Grid>
        )
    }

    /**
     * Generates the area for
     *  - Blade shape
     *  - Base shape
     *  - Hafting shape
     *  - Cross-section
     */
    attribute_area(){
        return(
            <BladeDetails
                base_shape={this.state.entity.base}
                blade_shape={this.state.entity.blade_shape}
                hafting_shape={this.state.entity.hafting_shape}
                cross_section={this.state.entity.cross_section}
                update_entity = {(k,v) => this.update_entity(k,v)}
            />
        )
    }

    /**
     * Generates the notes/description region
     */
    notes_area(){
        return(
            <NoteArea
                update_entity={(k,v) => this.update_entity(k,v)}
                value={this.state.entity.description}/>
        )
    }

    /**
     * Generates the area for editing dimensions
     * @return {JSX.Element}
     */
    dimensions_area(){
        return(
            <DimensionDetails
                update_entity={(k,v) => this.update_entity(k,v)}
                value={this.state.entity.dimensions}/>
        )
    }

    /**
     * Generates the region containing
     * - Dimensions
     * - Material
     */
    specs_area(){
        if(!this.props.adding_new) {
            return (
                <Grid item s={5}>
                    <Typography sx={{mt: 2}} varient="h6">
                        Dimensions: {this.state.entity.dimensions.filter(x => x >0).join("mm X ")}
                    </Typography>
                    <Typography sx={{mt: 2}} varient="h6">Material: {this.state.entity.material_id}</Typography>
                </Grid>
            )
        } else {
            return(
                <Grid item s={5}>
                {this.dimensions_area()}
                    <MaterialSelector
                        value = {this.state.selected_material}
                        update_entity = {(k,v) => this.update_entity(k,v)}
                    />
                </Grid>
            )
        }
    }

    /**
     * Generates the title which handles
     * - <SITE_ID>/<point_id>
     * - <Period>/<CULTURE>
     * - Location
     */
    title_area(){
        if(!this.props.adding_new){
        return(
            <Grid item xs={4}>
                <Typography sx={{fontWeight:"bold"}} varient="h4"> {this.props.site_name}/{this.entity._id ?? "NEW POINT"}</Typography>
                <Typography variant="body1">Middle Plains/Oxbow</Typography>
                <Typography variant="body1">Location:44deg wabba0</Typography>
            </Grid>
        )}
        else{
            return(
                <PeriodCultureSelector
                    period_id={this.state.entity.period_id}
                    culture_id={this.state.entity.culture_id}
                    update_entity={(k,v) => this.update_entity(k,v)}/>
            )}
    }

    render_fields() {
        return(
            <Grid container spacing={2}>
                {this.image_area()}
                {this.title_area()}
                {this.specs_area()}
                {this.attribute_area()}
                {this.notes_area()}
                <LocationDetails update_entity={(k,v) => this.update_entity(k,v)}/>
            </Grid>
        )
    }

    validate() {
    }

    render() {
        return(
            <div>
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
            </Dialog>
            </div>
        )
    }
}
export default ProjectileModal;