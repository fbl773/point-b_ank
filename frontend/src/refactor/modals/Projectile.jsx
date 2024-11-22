import EditCreateModal from "./EditCreateModal.jsx";
import http from "../../../http.js";
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
import {blade_shapes,base_shapes,hafting_shapes,cross_sections} from "../../entities/entities.js"
import React from "react";

class Projectile extends EditCreateModal{

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
        this.state.materials = [];
        this.state.selected_material = "";
        this.state.periods = [];
        this.state.cultures = [];
        this.state.base_shapes = [];
    }

    componentDidMount(){
        super.componentDidMount();
        this.setState({base_shapes:base_shapes});
        http.get("/materials")
            .then(mats => {
                this.setState({materials: mats.data});
            })
            .catch(err => console.error("Failed to fetch materials",err));

        http.get("/periods")
            .then(periods=> {
                this.setState({periods: periods.data});
            })
            .catch(err => console.error("Failed to fetch periods",err));

        http.get("/cultures")
            .then(cultures=> {
                this.setState({cultures: cultures.data});
            })
            .catch(err => console.error("Failed to fetch periods",err));
    }

    /**
     * Edits the dimensions field for entities
     * FORMAT IS L X W X H
     * @param idx - the idx to insert the dimensions at
     * @param dimension - the value of the dimension
     */
    edit_dimensions(idx,dimension){
        console.log(`CALLED WITH ${idx,dimension}!`);
        let dimensions = this.state.entity.dimensions;
        dimensions[idx]=dimension;
        this.update_entity("dimensions",dimensions);
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
        this.update_entity("material",mat_id)
        this.setState({selected_material:mat_name})
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
            <Grid item s={8}>
                <Typography varient="h3">Blade Details:</Typography>
                {/*Point Attributes*/}
                <FormControl fullWidth>
                    <InputLabel id="blade_shape-label">Blade Shape</InputLabel>
                    <Select
                        labelId="blade_shape-label"
                        id="blade_shape_select"
                        label="Blade Shape"
                        value={this.state.entity.blade_shape ?? ""}
                        renderValue={(selected) => selected}
                        onChange={(e) => this.update_entity("blade_shape",e.target.value)}>
                        {blade_shapes.map((bs )=> (
                            <MenuItem
                                value={bs}
                                key={bs}
                                selected={false}
                                onClick={(e) => this.update_entity("blade_shape",e.target.value)}
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
                        value={this.state.entity.base_shape ?? ""}
                        renderValue={(selected) => selected}
                        onChange={(e) => this.update_entity("base_shape",e.target.value)}>
                    {base_shapes.map((bs )=> (
                        <MenuItem
                            value={bs}
                            key={bs}
                            selected={false}
                            onClick={(e) => this.update_entity("base_shape",e.target.value)}
                        >{bs}</MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="hafting_shape-label">hafting Shape</InputLabel>
                    <Select
                        labelId="hafting_shape-label"
                        id="hafting_shape_select"
                        label="hafting Shape"
                        value={this.state.entity.hafting_shape ?? ""}
                        renderValue={(selected) => selected}
                        onChange={(e) => this.update_entity("hafting_shape",e.target.value)}>
                        {hafting_shapes.map((hs )=> (
                            <MenuItem
                                value={hs}
                                key={hs}
                                selected={false}
                                onClick={(e) => this.update_entity("hafting_shape",e.target.value)}
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
                        value={this.state.entity.cross_section ?? ""}
                        renderValue={(selected) => selected}
                        onChange={(e) => this.update_entity("cross_section",e.target.value)}>
                        {cross_sections.map((cs )=> (
                            <MenuItem
                                value={cs}
                                key={cs}
                                selected={false}
                                onClick={(e) => this.update_entity("cross_section",e.target.value)}
                            >{cs}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Grid>
        )
    }

    /**
     * Generates the notes/description region
     */
    notes_area(){
        return(
            <Grid item s={5}>
                <TextField
                    minRows={5}
                    maxRows={5}
                    multiline={true}
                    autoFocus
                    id="notes"
                    label="Notes"
                    fullWidth
                    required
                    value={this.state.entity.description}
                    onChange={(e) => this.update_entity("description",e.target.value)}
                    />


                <Typography sx={{mt:2}} varient="h6">Notes:</Typography>
                <Typography varient="body1">{this.state.entity.description}</Typography>
            </Grid>
        )
    }

    /**
     * Generates the area for editing dimensions
     * @return {JSX.Element}
     */
    dimensions_area(){
        return(
            <div>
            <Typography varient="h3" style={{paddingBottom:"8px"}}>Dimensions: </Typography>
            <TextField
                autoFocus
                id={"length"}
                label="Length (mm)"
                style={{paddingTop:"8px",paddingBottom:"8px"}}
                fullWidth
                value={this.state.entity.dimensions[0]}
                onChange={e => this.edit_dimensions(0,e.target.value)}
            />
            <TextField
                autoFocus
                id={"width"}
                label="Width (mm)"
                style={{paddingTop:"8px",paddingBottom:"8px"}}
                fullWidth
                value={this.state.entity.dimensions[1]}
                onChange={e => this.edit_dimensions(1,e.target.value)}
            />
            <TextField
                autoFocus
                id={"height"}
                label="Height (mm)"
                style={{paddingTop:"8px",paddingBottom:"8px"}}
                fullWidth
                value={this.state.entity.dimensions[2]}
                onChange={e => this.edit_dimensions(2,e.target.value)}
            />
            </div>
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
        return(
            <Grid item xs={4}>
                <Typography sx={{fontWeight:"bold"}} varient="h4"> SiteID/G00B3R </Typography>
                <Typography variant="body1">Middle Plains/Oxbow</Typography>
                <Typography variant="body1">Location:44deg wabba0</Typography>
            </Grid>
        )
    }

    render_fields() {
        return(
            <Grid container spacing={2}>
                {this.image_area()}
                {this.title_area()}
                {this.specs_area()}
                {this.attribute_area()}
                {this.notes_area()}
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
export default Projectile;