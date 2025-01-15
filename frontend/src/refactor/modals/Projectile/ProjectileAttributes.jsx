import React, {Component} from "react";
import {FormControl, FormLabel, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {base_shapes, blade_shapes, cross_sections, hafting_shapes} from "../../../entities/entities.js";
import TextField from "@mui/material/TextField";
import http from "../../../../http.js";
import form from "jsdom/lib/jsdom/living/fetch/header-list.js";

/**
 * Component responsible for handling the disply of artifact images and formating them as FormData to
 * be uploaded to the server
 */
export class ArtifactImage extends Component{
    constructor() {
        super();
        this.state={
            img_preview:""
        }
    }

    componentDidMount() {
        //TODO: Get the image (gulp)
    }

    /**
     * @syopsis: updates the preview of the image, converts it to FormData, and fires it back to the host component for
     * upload
     * @param e - the FileChangeEvent
     */
    update_photo(e){
        e.preventDefault()
        let file = e.target.files[0];
        if(file) {
            const form_data = new FormData()
            form_data.append("file", file);
            console.log("uploading file...",form_data);
            this.props.update_image(form_data);
            this.setState({img_preview:URL.createObjectURL(file)});
        } else {
            //TODO:Implement actual error message
            alert("FAILED TO UPLOAD IMAGE")
        }
    }

    /**
     * The area the hosts the image preview
     * @return {Element}
     */
    preview(){
        return(
                <img
                    id="artifact_img"
                    src={this.state.img_preview ?? ""}
                    style={{maxWidth: "100%"}}
                    alt="Add a photo..."/>
        )
    }

    render() {
        return(
            <Grid item xs={7} >
                {this.preview()}
                <FormControl sx={{ my: 3.4 }}>
                    <FormLabel sx={{ mb: 1.5 }}>
                        Upload New Photo
                    </FormLabel>
                    <input type="file" onChange={(e => this.update_photo(e))} accept="image/*" />
                </FormControl>
            </Grid>
        )
    }


}

/**
 * Component to hold the blade attributes of a projectile point
 */
export class BladeDetails extends Component {
    constructor() {
        super();
        this.state={
            blade_shape:"",
            base_shape:"",
            hafting_shape:"",
            cross_section:"",
        }
    }

    componentDidMount() {
        //Populate with existing values
        this.setState({
            base_shape:this.props.base_shape,
            blade_shape:this.props.blade_shape,
            hafting_shape:this.props.hafting_shape,
            cross_section:this.props.cross_section,
        })
    }

    /**
     * Helper to update _this_ component's state & the parent's as they are changed.
     * @param k - the blade attribute to edit
     * @param v - the value to set the blade attribute to
     */
    update_details(k, v){
        let update_me = this.state;
        update_me[k] = v;
        this.setState({update_me}); //Update our values
        this.props.update_entity(k,v); //Update the entity's values
    }

    /**
     * Builds a selector for any of the 4 point attributes
     * @param prop_name the name of the property to update
     * @param label the label we put on its selector
     * @param values the potential values it could have
     * @return {Element} - a dropdown for <prop_name> with values <values>
     */
    attribute_selector(prop_name,label,values){
        return(
            <FormControl fullWidth>
                <InputLabel id={`${prop_name}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${prop_name}-label`}
                    id={`${prop_name}_select`}
                    label={label}
                    value={this.state[prop_name] ?? ""}
                    renderValue={(selected) => selected}
                    onChange={(e) => this.update_details(prop_name,e.target.value)}>
                    {values.map((opt )=> (
                        <MenuItem
                            value={opt}
                            key={opt}
                            selected={false}
                            onClick={(e) => this.update_details(prop_name,e.target.value)}
                        >{opt}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    }

    render() {
        return(
            <Grid item s={8}>
                <Typography varient="h3">Blade Details:</Typography>
                {/*Point Attributes*/}
                {this.attribute_selector("blade_shape","Blade Shape",blade_shapes)}
                {this.attribute_selector("base_shape","Base Shape",base_shapes)}
                {this.attribute_selector("hafting_shape","Hafting Shape",hafting_shapes)}
                {this.attribute_selector("cross_section","Cross Section",cross_sections)}
            </Grid>
        )
    }
}

/**
 * A drop-down selector to fetch materials from the DB for point configuration
 */
export class MaterialSelector extends Component{
    constructor() {
        super();
        this.state={
            selected_material:"",
            materials:[],
            loaded:false
        }
    }

    componentDidMount() {
        http.get("/materials")
            .then(mats => {
                this.setState({materials: mats.data},() =>{
                    this.setState({loaded:true})
                    this.select_material(this.props.value);
                });
            })
            .catch(err => console.error("Failed to fetch materials",err));

    }


    /**
     * Selects the passed material and updates the PP entity accordingly
     * @param material:Material - the material we will be updating
     */
    select_material(mat_id){
        console.log("Selecting material...", mat_id);
        console.log("Materials are : ", this.state.materials);
        // Get the values if present
        let mat = this.state.materials.filter(m => m._id === mat_id)[0] ?? {};
        //Update the entity, and the user facing display
        this.props.update_entity("material_id", mat._id ?? "");
        console.log("Selected material.id:", mat._id);
        this.setState({selected_material: mat});

    }

    render() {
        //TODO: We _could_ generalize the entire selector like we did before. maybe we have a "general utils" for forms?
        return(
            <>
            {this.state.loaded ?
            <FormControl fullWidth>
                <InputLabel id="material-label">Material</InputLabel>
                <Select
                    labelId="material-label"
                    id="material_select"
                    label="Material"
                    value={this.state.selected_material.name ?? "Indeterminate"}
                    renderValue={(selected) => selected}
                    onChange={(e) => this.select_material(e.target.value._id)}
                >
                    {this.state.materials.map((mat)=> (
                        <MenuItem
                            key={mat._id}
                            value={mat}
                            selected={false}
                        >{mat.name}</MenuItem>
                    ))}
                    <MenuItem key="none" value="">Indeterminate</MenuItem>
                </Select>
            </FormControl>:<h1>Loading...</h1>}
            </>
        )
    }
}

/**
 * The Lenght, width, and height configuration for an artifact.
 */
export class DimensionDetails extends Component{
    constructor() {
        super();
        //TODO: Do we _need_ a height?
        this.state = {
            dimensions:[0,0,0]
        }
    }

    componentDidMount() {
        this.setState({dimensions:this.props.value})
    }

    /**
     * Edits the dimensions field for entities
     * FORMAT IS L X W X H
     * @param idx - the idx to insert the dimensions at
     * @param dimension - the value of the dimension
     */
    edit_dimensions(idx,dimension){
        let dimensions = this.state.dimensions
        dimensions[idx]=dimension;
        this.setState({dimensions:dimensions});
        this.props.update_entity("dimensions",dimensions);
    }


    /**
     * Creates a text edit field for a dimension
     * @param prop_name The name of the dimension property
     * @param idx the dimensions idx in the dimension array
     * @param label the user-facing label for the field
     * @return {Element} - A Text field for editing a dimension.
     */
    edit_dimension(prop_name,idx,label){
        return(
            <TextField
                id={prop_name}
                label={label}
                style={{paddingTop: "8px", paddingBottom: "8px"}}
                fullWidth
                value={this.state.dimensions[idx]}
                onChange={e => this.edit_dimensions(idx, e.target.value)}
            />
        )
    }

    render(){
        return (
            <div>
                <Typography varient="h3" style={{paddingBottom: "8px"}}>Dimensions (mm): </Typography>
                {this.edit_dimension('length',0,"Length")}
                {this.edit_dimension('width',1,"Width")}
                {this.edit_dimension('height',2,"Height")}
            </div>
        )
    }
}

/**
 * Pretty basic for right now, simply a text field to denote location
 */
export class LocationDetails extends Component{
    constructor() {
        super();
        this.state = {
            location:""
        }
    }

    componentDidMount() {
        this.setState({location:this.props.location})
    }

    //TODO: This could also be a general textfield updater
    render() {
        return(
        <TextField
            id={"location"}
            label="Location"
            style={{paddingTop:"8px",paddingBottom:"8px"}}
            fullWidth
            value={this.state.location}
            onChange={e => this.props.update_entity("location",e.target.value)}
        />
        )
    }
}

/**
 * Selector for Period/Culture for a point
 */
export class PeriodCultureSelector extends Component {
    constructor() {
        super();

        this.state = {
            cultures:[],
            periods:[],
            selected_period: "",
            selected_culture: "",
            display_cultures:[],
            display_periods:[],
        }
    }

    /**
     * Sets the selected period and adjusts available cultures accordinglyk
     * @param period the period object that has been selected
     * @param period._id mongo id of the period, used to filter cultures
     * @param period.name friendly name of the period
     */
    select_period(period){
        let period_id = period._id ?? "";
        let period_name = period.name ?? "Indeterminate";

        //UPDATE AVAIL CULTURES
        let filtered_cultures = this.state.cultures.filter(culture => culture.period_id === period_id)
        this.setState({display_cultures:filtered_cultures})

        //Set the parent and update state for selected
        this.props.update_entity("period_id",period_id)
        this.setState({selected_period:period_name})
    }

    /**
     * Updates the culture and selects the appropriate period
     * @param culture - the culture object we will be selecting
     * @param culture._id:string the mongo_id of the culture, used to select appt. period
     * @param culture.name:string the friendly name of the culture we have selected
     * @param culture.period_id:string the mongoid of the period that this culture belongs to.
     */
    select_culture(culture){
        let culture_id = culture._id ?? "";
        let culture_name = culture.name ?? "Indeterminate";

        //Filter PERIODS to autoselect
        if (culture_name !== "Indeterminate") {
            let period = this.state.periods.filter(period => period._id === culture.period_id)[0] ?? "Indeterminate";
            this.setState({selected_period: period.name})
            this.props.update_entity("period_id", period._id)
        }

        //update the parent artifact
        this.props.update_entity("culture_id",culture_id)
        this.setState({selected_culture:culture_name})
    }

    componentDidMount() {

        //TODO: Again, we _could_ fetch these at a site level to save API calls, but separation of concerns is real...

        // Go Get the periods/cultures
        http.get("/periods")
            .then(periods=> {
                this.setState({periods: periods.data,display_periods:periods.data});
            })
            .catch(err => console.error("Failed to fetch periods",err));

        http.get("/cultures")
            .then(cultures=> {
                this.setState({cultures: cultures.data,display_cultures:cultures.data});
            })
            .catch(err => console.error("Failed to fetch periods",err));

        //Fetch period/culture if exists
        let pre_culture = this.state.cultures.filter(culture => culture._id === this.props.culture_id)[0] ?? "Indeterminate";
        let pre_period = this.state.periods.filter(period => period._id === this.props.period_id)[0] ?? "Indeterminate";

        //Set them as default values
        this.setState({selected_period:pre_period});
        this.setState({selected_culture:pre_culture});
    }

    render() {
       return(
           <Grid item xs={4}>
               {/*PERIOD SELECTOR*/}
               <InputLabel id="period-label">Period</InputLabel>
               <FormControl fullWidth>
                   <Select
                       labelId="period-label"
                       id="period_select"
                       label="Period"
                       value={this.state.selected_period ?? ""}
                       renderValue={(selected) =>selected}
                       onChange={(e) => this.select_period(e.target.value)}
                   >
                       {this.state.display_periods.map((period)=> (
                           <MenuItem
                               key={period._id}
                               value={period}
                               selected={false}
                           >{period.name} ({period.start}-{period.end} BP)</MenuItem>
                       ))}

                       <MenuItem key="none" value="Indeterminate">Indeterminate</MenuItem>
                   </Select>
               </FormControl>

               {/*CULTURE SELECTOR*/}
               <InputLabel id="culture-label">Culture</InputLabel>
               <FormControl fullWidth>
                   <Select
                       labelId="culture-label"
                       id="culture_select"
                       label="culture"
                       value={this.state.selected_culture ?? ""}
                       renderValue={(selected) =>selected}
                       onChange={(e) => this.select_culture(e.target.value)}
                   >
                       {this.state.display_cultures.map((culture)=> (
                           <MenuItem
                               key={culture._id}
                               value={culture}
                               selected={false}
                           >{culture.name} ({culture.start}-{culture.end} BP)</MenuItem>
                       ))}
                       <MenuItem key="none" value="Indeterminate">Indeterminate</MenuItem>
                   </Select>
               </FormControl>
           </Grid>
       )
    }


}

export class NoteArea extends Component{

    constructor() {
        super();
        this.state={description:"wat"};
    }

    componentDidMount() {
        this.setState({description:this.props.value})
    }

    update_note(e){
        let note = e.target.value;
        this.setState({description:note});
        this.props.update_entity("description",note)
    }

    render(){
        return(
            <Grid item s={5}>
                <TextField
                    minRows={5}
                    maxRows={5}
                    multiline={true}
                    id="notes"
                    label="Notes"
                    fullWidth
                    value={this.state.description}
                    onChange={(e) => this.update_note(e)}
                />

                <Typography sx={{mt:2}} varient="h6">Notes:</Typography>
                <Typography varient="body1">{this.state.description}</Typography>
            </Grid>
        )
    }
}