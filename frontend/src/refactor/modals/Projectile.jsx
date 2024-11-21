import EditCreateModal from "./EditCreateModal.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid, TextareaAutosize,
    Typography
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {Projectile_Point} from "../../entities/entities.js";

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
                <Typography varient="h3">Details:</Typography>
                {/*Point Attributes*/}
                <TextField
                autoFocus
                id="blade_shape"
                label="Blade Shape"
                fullWidth
                value={this.state.entity.blade_shape}
                onChange={e => this.update_entity("blade_shape",e.target.value)}/>

                <TextField
                    autoFocus
                    id="base_shape"
                    label="Base Shape"
                    fullWidth
                    value={this.state.entity.base_shape}
                    onChange={e => this.update_entity("base_shape",e.target.value)}/>

                <TextField
                    autoFocus
                    id="hafting_shape"
                    label="Hafting Shape"
                    fullWidth
                    value={this.state.entity.hafting_shape}
                    onChange={e => this.update_entity("hafting_shape",e.target.value)}/>

                <TextField
                    autoFocus
                    id="hafting_shape"
                    label="Hafting Shape"
                    fullWidth
                    value={this.state.entity.hafting_shape}
                    onChange={e => this.update_entity("hafting_shape",e.target.value)}/>

                <TextField
                    autoFocus
                    id="cross_section"
                    label="Cross Section"
                    fullWidth
                    value={this.state.entity.cross_section}
                    onChange={e => this.update_entity("hafting_shape",e.target.value)}/>

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
                    value={this.state.entity.note}
                    onChange={(e) => this.update_entity("note",e.target.value)}
                    />


                <Typography sx={{mt:2}} varient="h6">Description:</Typography>
                <Typography varient="body1">This would be the description</Typography>
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
            <TextField
                autoFocus
                id={"length"}
                label="Length"
                fullWidth
                value={this.state.entity.dimensions[0]}
                onChange={e => this.edit_dimensions(0,e.target.value)}
            />
            <TextField
                autoFocus
                id={"width"}
                label="Width"
                fullWidth
                value={this.state.entity.dimensions[1]}
                onChange={e => this.edit_dimensions(1,e.target.value)}
            />
            <TextField
                autoFocus
                id={"height"}
                label="Height"
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
                    <Typography sx={{mt: 2}} varient="h6">Material: boop</Typography>
                </Grid>
            )
        } else {
            return(
                <Grid item s={5}>
                {this.dimensions_area()}
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