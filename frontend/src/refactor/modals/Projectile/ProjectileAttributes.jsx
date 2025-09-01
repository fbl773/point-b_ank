import React, {Component} from "react";
import {FormControl, FormLabel, Grid, IconButton, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {base_shapes, blade_shapes, cross_sections, hafting_shapes,Period} from "../../../entities/entities.js";
import TextField from "@mui/material/TextField";
import http from "../../../../http.js";
import CircularProgress from "@mui/material/CircularProgress";
import { Stack } from "@mui/system";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

/**
 * Component responsible for handling the disply of artifact images and formating them as FormData to
 * be uploaded to the server
 */
export class ArtifactImage extends Component{
    constructor(props) {
        super(props);
        this.state={
            img_preview:"",
            img_name:this.props.img_name,
        }
    }

    componentDidMount() {
        if(this.props.img_name !== ""){
            console.log("Image name",this.props.img_name);
            let img_path = `${this.props.hostname}/uploads/sites/${this.props.site_id}/${this.props.artifact_id}/${this.props.img_name}`
            this.setState({img_preview:img_path},() => {
                console.log("Looking for img at:",img_path)
            });
        }
    }


    /**
     * Deletes an image... but probably shouldn't .
     * What _should_ happen is that when a point is _saved_ any 'images' that are not in the original set (i.e.
     * before the update) then they should be deleted... THIS IS A TRIGGER RESPONSIBILITY.
     * @param img_id
     * @returns {Promise<T | void>}
     */
    async delete_image(img_id){

        let img_path = `sites/${this.props.site_id}/upload/${this.props.artifact_id}/${img_id}`
        return http.delete(img_path)
            .then(resp => {
                console.log('got response',resp.data)
                if(resp.data.filename){
                    this.props.update_entity('image','')
                    this.setState({img_preview:''})
                }
            })
            .catch(err => console.error("FAILED TO REMOVE IMAGE", err))
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
            this.props.update_image(form_data);
            this.setState({img_preview:URL.createObjectURL(file)});
            this.props.update_entity("image",file.name);
        } else {
            //TODO:Implement actual error message -- this should be an issue then
            alert("FAILED TO UPLOAD IMAGE")
        }
    }

    /**
     * The area the hosts the image preview
     * @return {Element}
     */
    preview(){
        return(
            <Stack>
                <img
                    id="artifact_img"
                    src={this.state.img_preview ?? ""}
                    style={{maxWidth: "100%"}}
                    alt="Add a photo..."/>
                {this.state.img_preview &&
                <Stack direction='row' spacing='2' justifyContent='space-between'>
                    <IconButton>
                        <ChevronLeft/>
                    </IconButton>
                    <IconButton
                        disabled={!this.state.img_preview}
                        color='error'
                        onClick={() => {
                            console.log('deleting image:',this.state.img_preview)
                            this.delete_image(this.state.img_name);
                        }}> <DeleteIcon/> </IconButton>
                    <IconButton>
                        <ChevronRight/>
                    </IconButton>
                </Stack>
                }
            </Stack>

        )
    }

    render() {
        return (
            <Stack width='100%'>
                {this.preview()}
                <FormControl sx={{my: 3.4}}>

                <FormLabel sx={{ mb: 1.5 }}>
                        Upload New Photo
                    </FormLabel>
                    <input type="file" onChange={(e => this.update_photo(e))} accept="image/*"/>

                </FormControl>
            </Stack>
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
     * @param v - the value to set the blade attribute to>
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
                <FormControl>
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
            <Stack width="50%" spacing={2}>
                <Typography varient="h3">Blade Details:</Typography>

                {/*Point Attributes*/}
                {this.attribute_selector("blade_shape","Blade Shape",blade_shapes)}
                {this.attribute_selector("base_shape","Base Shape",base_shapes)}
                {this.attribute_selector("hafting_shape","Hafting Shape",hafting_shapes)}
                {this.attribute_selector("cross_section","Cross Section",cross_sections)}
            </Stack>
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

    /**
     * Fetches the materials from the database and assigns the selected material if present
     */
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
        // Get the values if present
        let mat = this.state.materials.filter(m => m._id === mat_id)[0] ?? {};
        //Update the entity, and the user facing display
        this.props.update_entity("material_id", mat._id ?? "");
        this.setState({selected_material: mat});

    }

    render() {
        //TODO: We _could_ generalize the entire selector like we did before. maybe we have a "general utils" for forms? --This is a good idea.
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
            </FormControl>:<CircularProgress/>}
            </>
        )
    }
}

/**
 * The Lenght, width, and height configuration for an artifact.
 */
export class DimensionDetails extends Component{
    constructor(props) {
        super(props);
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
                <Stack spacing={2}>
                {this.edit_dimension('length',0,"Length")}
                {this.edit_dimension('width',1,"Width")}
                {this.edit_dimension('height',2,"Height")}
                </Stack>
            </div>
        )
    }
}

/**
 * Pretty basic for right now, simply a text field to denote location
 */
export class LocationDetails extends Component{

    constructor(props) {
        super(props);
        this.state = {
            location:""
        }
    }


    componentDidMount() {
        this.setState({location:this.props.location})
    }

    handleChangeLocation(e) {
        this.setState({location:e.target.value});
        this.props.update_entity("location",e.target.value)
    }

    //TODO: This could also be a general textfield updater
    render() {
        return(
        <TextField
            id={"location"}
            label="Location"
            fullWidth
            value={this.state.location}
            onChange={(e) => this.handleChangeLocation(e)}
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
     * @param period_id the id of the period we have selected
     */
    select_period(period_id){

        //UPDATE AVAIL CULTURES
        let period= this.state.periods.filter(p=> p._id === period_id)[0] ?? {};
        let prev_id = this.state.period_id;

        let filtered_cultures = this.state.cultures.filter(culture => culture.period_id === period_id);
        this.setState({display_cultures:filtered_cultures});

        //Set the parent and update state for selected
        this.props.update_entity("period_id",period_id);
        this.setState({selected_period:period});

        //reset culture if the period changed
        if(prev_id !== period_id){
            this.select_culture("");
        }
    }

    /**
     * Updates the culture and selects the appropriate period
     * @param culture_id the ID of the culutre we have selected.
     */
    select_culture(culture_id){
        let culture = this.state.cultures.filter(c => c._id === culture_id)[0] ?? {};
        let culture_name = culture.name ?? "Indeterminate";

        //Filter PERIODS to autoselect
        if (culture_name !== "Indeterminate") {
            let period = this.state.periods.filter(period => period._id === culture.period_id)[0] ?? "Indeterminate";
            this.setState({selected_period: period})
            this.props.update_entity("period_id", period._id)
        }

        //update the parent artifact
        this.props.update_entity("culture_id",culture_id)
        this.setState({selected_culture:culture})
    }

    componentDidMount() {
        // Go Get the periods/cultures
        http.get("/periods")
            .then(periods=> {
                this.setState({periods: periods.data,display_periods:periods.data},() =>{
                    this.select_culture(this.props.culture_id);
                });
            })
            .catch(err => console.error("Failed to fetch periods",err));

        http.get("/cultures")
            .then(cultures=> {
                this.setState({cultures: cultures.data,display_cultures:cultures.data}, () =>{
                    this.select_period(this.props.period_id);
                });
            })
            .catch(err => console.error("Failed to fetch periods",err));
    }

    /**
     * TODO: if we get a default "selector" class for materials and such, this could probably use it.
     * @return {Element}
     */
    render() {
       return(
           <Stack>
               {/*PERIOD SELECTOR*/}
               <InputLabel shrink id="period-label" variant={'filled'}>Period</InputLabel>
               <FormControl fullWidth>
                   <Select
                       labelId="period-label"
                       id="period_select"
                       label="Period"
                       value={this.state.selected_period.name?? "Indeterminate"}
                       renderValue={(selected) =>selected}
                       onChange={(e) => this.select_period(e.target.value._id)}
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
               <InputLabel shrink variant='filled' id="culture-label">Culture</InputLabel>
               <FormControl fullWidth>
                   <Select
                       labelId="culture-label"
                       id="culture_select"
                       label="culture"
                       value={this.state.selected_culture.name ?? "Indeterminate"}
                       renderValue={(selected) =>selected}
                       onChange={(e) => this.select_culture(e.target.value._id)}
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
           </Stack>
       )
    }


}

export class NoteArea extends Component{

    constructor(props) {
        super(props);
        this.state={description:"wat"};
    }

    componentDidMount() {
        this.setState({description:this.props.value})
    }

    update_note(e){
        let note = e.target.value;
        this.setState({description:note},() =>{
                this.props.update_entity("description",note)
        });
    }

    render(){
        return(
                <TextField
                    sx={{height:'100%'}}
                    fullWidth
                    minRows={5}
                    maxRows={5}
                    multiline={true}
                    id="notes"
                    label="Notes"
                    value={this.state.description}
                    onChange={(e) => this.update_note(e)}
                />
        )
    }
}