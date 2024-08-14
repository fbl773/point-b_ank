import EditCreateModal from "./EditCreateModal.jsx";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography
} from "@mui/material";

class Projectile extends EditCreateModal{

    constructor(props) {
        super(props);
    }

    /**
     * Generates the area associated with the image collection
     */
    image_area(){
        return(
            <Grid item xs={6}>
                <img
                    src={"/wat"}
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
            <Grid item s={6}>
                <Typography varient="h3">Attributes</Typography>
            </Grid>
        )
    }

    /**
     * Generates the notes/description region
     */
    notes_area(){
        return(
            <Grid item s={6}>
                <Typography sx={{mt:2}} varient="h6">Description</Typography>
                <Typography varient="body1">This would be the description</Typography>
            </Grid>
        )
    }

    /**
     * Generates the region containing
     * - Dimensions
     * - Material
     */
    specs_area(){
        return(
            <Grid item s={6}>
                <Typography sx={{mt:2}} varient="h6">Dimensions: 4 x 8 x 16 </Typography>
                <Typography sx={{mt:2}} varient="h6">Material: boop</Typography>
            </Grid>
        )
    }

    /**
     * Generates the title which handles
     * - <SITE_ID>/<point_id>
     * - <Period>/<CULTURE>
     * - Location
     */
    title_area(){
        return(
            <Grid item l={6}>
                <Typography sx={{fontWeight:"bold"}} varient="h4">
                    SiteID/G00B3R
                </Typography>
                <Typography variant="body1">Middle Plains/Oxbow</Typography>
                <Typography variant="body1">Location:44deg wabba0</Typography>
            </Grid>
        )
    }

    render_fields() {
        return(
            <Grid container spacing={6} sx={{paddingTop:0}}>
                {this.title_area()}
                {this.image_area()}
                {this.specs_area()}
                {this.attribute_area()}
                {this.notes_area()}
            </Grid>
        )
    }

    validate() {
    }

    render() {
        return super.render();
    }
}