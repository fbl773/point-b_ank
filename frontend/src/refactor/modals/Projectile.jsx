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
            </Grid>
        )
    }

    /**
     * Generates the notes/description region
     */
    notes_area(){
        return(
            <Grid item s={5}>
                <Typography sx={{mt:2}} varient="h6">Description:</Typography>
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
            <Grid item s={5}>
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