import React, {Component} from "react";
import {FormControl, FormLabel, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {base_shapes, blade_shapes, cross_sections, hafting_shapes} from "../../../entities/entities.js";
import TextField from "@mui/material/TextField";
import http from "../../../../http.js";
import form from "jsdom/lib/jsdom/living/fetch/header-list.js";


export class ArtifactImage extends Component{
    constructor() {
        super();

        this.state={
            img_data:""
        }
    }

    componentDidMount() {
        //Get the image (gulp)
    }

    update_photo(e){
        e.preventDefault()
        let file = e.target.files[0];
        if(file) {
            const form_data = new FormData()
            form_data.append("file", file);
            console.log("uploading file...",form_data);
            this.props.update_image(form_data);
            this.setState({img_data:URL.createObjectURL(file)});
        } else {
            alert("FAILED TO UPLOAD IMAGE")
        }
    }

    img_preview(){
        return(
                <img
                    id="artifact_img"
                    src={this.state.img_data ?? ""}
                    style={{maxWidth: "100%"}}
                    alt="Add a photo..."/>
        )
    }

    render() {
        return(
            <Grid item xs={7} >
                {this.img_preview()}
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

    update_details(k, v){
        let update_me = this.state;
        update_me[k] = v;
        this.setState({update_me});
        this.props.update_entity(k,v);
    }

    render() {
        return(
            <Grid item s={8}>
                <Typography varient="h3">Blade Details:</Typography>
                {/*Point Attributes*/}
                <FormControl fullWidth>
                    <InputLabel id="blade_shape-label">Blade Shape</InputLabel>
                    <Select
                        labelId="blade_shape-label"
                        id="blade_shape_select"
                        label="Blade Shape"
                        value={this.state.blade_shape ?? ""}
                        renderValue={(selected) => selected}
                        onChange={(e) => this.update_details("blade_shape",e.target.value)}>
                        {blade_shapes.map((bs )=> (
                            <MenuItem
                                value={bs}
                                key={bs}
                                selected={false}
                                onClick={(e) => this.update_details("blade_shape",e.target.value)}
                            >{bs}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="base_shape-label">Base Shape</InputLabel>
                    <Select
                        labelId="base_shape-label"
                        id="base_shape_select"
                        label="Base Shape"
                        value={this.state.base_shape ?? ""}
                        renderValue={(selected) => selected}
                        onChange={(e) => this.update_details("base_shape",e.target.value)}>
                        {base_shapes.map((bs )=> (
                            <MenuItem
                                value={bs}
                                key={bs}
                                selected={false}
                                onClick={(e) => this.update_details("base_shape",e.target.value)}
                            >{bs}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="hafting_shape-label">Hafting Shape</InputLabel>
                    <Select
                        labelId="hafting_shape-label"
                        id="hafting_shape_select"
                        label="hafting Shape"
                        value={this.state.hafting_shape ?? ""}
                        renderValue={(selected) => selected}
                        onChange={(e) => this.update_details("hafting_shape",e.target.value)}>
                        {hafting_shapes.map((hs )=> (
                            <MenuItem
                                value={hs}
                                key={hs}
                                selected={false}
                                onClick={(e) => this.update_details("hafting_shape",e.target.value)}
                            >{hs}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="cross_section-label">Cross Section</InputLabel>
                    <Select
                        labelId="cross_section-label"
                        id="cross_section_select"
                        label="Cross Sectrion"
                        value={this.state.cross_section ?? ""}
                        renderValue={(selected) => selected}
                        onChange={(e) => this.update_details("cross_section",e.target.value)}>
                        {cross_sections.map((cs )=> (
                            <MenuItem
                                value={cs}
                                key={cs}
                                selected={false}
                                onClick={(e) => this.update_details("cross_section",e.target.value)}
                            >{cs}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Grid>
        )
    }
}

export class MaterialSelector extends Component{
    constructor() {
        super();
        this.state={
            selected_material:"",
            materials:[]
        }
    }

    componentDidMount() {
        this.setState({selected_material:this.props.value});

        http.get("/materials")
            .then(mats => {
                this.setState({materials: mats.data});
            })
            .catch(err => console.error("Failed to fetch materials",err));
    }


    /**
     * Selects the passed material and updates the PP entity accordingly
     * @param material:Material - the material we will be updating
     */
    select_material(material){
        // Get the values if present
        let mat_id = material._id ?? "";
        let mat_name = material.name ?? "Indeterminate";

        //Update the entity, and the user facing display
        this.props.update_entity("material_id",mat_id);
        this.setState({selected_material:mat_name});
    }

    render() {
        return(
            <FormControl fullWidth>
                <InputLabel id="material-label">Material</InputLabel>
                <Select
                    labelId="material-label"
                    id="material_select"
                    label="Material"
                    value={this.state.selected_material?? ""}
                    renderValue={(selected) => selected}
                    onChange={(e) => this.select_material(e.target.value)}
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
            </FormControl>
        )
    }
}

export class DimensionDetails extends Component{
    constructor() {
        super();
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

    render(){
        return (
            <div>
                <Typography varient="h3" style={{paddingBottom: "8px"}}>Dimensions: </Typography>
                <TextField
                    id={"length"}
                    label="Length (mm)"
                    style={{paddingTop: "8px", paddingBottom: "8px"}}
                    fullWidth
                    value={this.state.dimensions[0]}
                    onChange={e => this.edit_dimensions(0, e.target.value)}
                />
                <TextField
                    id={"width"}
                    label="Width (mm)"
                    style={{paddingTop: "8px", paddingBottom: "8px"}}
                    fullWidth
                    value={this.state.dimensions[1]}
                    onChange={e => this.edit_dimensions(1, e.target.value)}
                />
                <TextField
                    id={"height"}
                    label="Height (mm)"
                    style={{paddingTop: "8px", paddingBottom: "8px"}}
                    fullWidth
                    value={this.state.dimensions[2]}
                    onChange={e => this.edit_dimensions(2, e.target.value)}
                />
            </div>
        )
    }
}

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

    select_period(period){
        let period_id = period._id ?? "";
        let period_name = period.name ?? "Indeterminate";

        //UPDATE CULTURES
        let filtered_cultures = this.state.cultures.filter(culture => culture.period_id === period_id)

        this.setState({display_cultures:filtered_cultures})

        this.props.update_entity("period_id",period_id)
        this.setState({selected_period:period_name})
    }

    select_culture(culture){
        let culture_id = culture._id ?? "";
        let culture_name = culture.name ?? "Indeterminate";

        //Filter PERIODS
        if (culture_name !== "Indeterminate") {
            let period = this.state.periods.filter(period => period._id === culture.period_id)[0] ?? "Indeterminate";
            this.setState({selected_period: period.name})
            this.props.update_entity("period_id", period._id)
        }

        this.props.update_entity("culture_id",culture_id)
        this.setState({selected_culture:culture_name})
    }

    componentDidMount() {

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