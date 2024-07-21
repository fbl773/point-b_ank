/* eslint-disable react/prop-types */
import {
    TextField,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions, MenuItem, Typography,
} from "@mui/material";
import {Component} from "react";
import http from "../../http";

class CultureModal extends Component{

    /**
     * Constructs the modal to creat a new culture
     * @param props
     * @param props.on_close:Function how we close this modal.
     * @param props.adding_new:Boolean - true/false are we creating a culture
     * @param props.append_culture:Function append callback to the managemnt page.
     */
    constructor(props) {
        super(props);

        this.state = {
            title:"...",
            periods:[],
            selected_period:{},
            culture: {
                _id: "",
                name: "",
                start: null,
                end:null,
                period_id:"",
            }
        }
    }

    /**
     * Fetches the periods available to be configured
     */
    get_periods() {
        http.get('/periods')
            .then(resp => {
                let periods = resp.data;
                this.setState({periods:periods})
            })
            .catch(err => console.log(`Failed to fetch periods`,err));
    }

    /**
     * Sets the component up upon mounting
     */
    componentDidMount() {
        //go get the periods
        this.get_periods();
        this.set_selected_period = this.set_selected_period.bind(this);

        //Dynamically configure functionality to fit configured option
        if(this.props.adding_new){
            this.handleSubmit = this.addCulture.bind(this);
            this.setState({title:"Add"});
        } else {
            this.handleSubmit = this.editCulture.bind(this);
            this.setState({title:"Edit",culture:this.props.culture});

        }
    }

    /**
     * Updates the contained culture sub-object
     * @param key {String} the key to the field of a culture object we seek to edit
     * @param val {any} the value to set it to
     * @issues: #45 - Cannot stop entry of non-numeric input for numeric fields due to MUI being trash
     */
    update_culture = (key,val) =>{
        let updated_culture = this.state.culture;
        if(key === "start" || key === "end"){
            let as_num = parseInt(val,10)
            val = isNaN(as_num) ? null:as_num
        }
        updated_culture[key] = val;
        this.setState({culture:updated_culture});
    }

    /**
     * Set the configured period
     * @param period {Period} the period to associate with this culture
     */
    set_selected_period(period) {
        this.setState({selected_period:period});
        this.update_culture('period',period)
    }

    /**
     * Validates the save conditions
     * @return name is longer than 0 and ybp_start > ybp_end
     */
    validate = () =>{
        //fetch entity to validate
        let culture = this.state.culture;
        let period = this.state.selected_period;
        //Check basics
        let name_vaid = culture.name.length > 0; //Has a title
        let has_period = culture.period_id.length > 0;

        //Check dates
        let dates_internal_validity = culture.start >= culture.end; //Dates are in bp (before present)...
        let dates_external_validity = culture.end >= period.end && culture.start <= period.start;
        let dates_valid = dates_external_validity && dates_internal_validity;
        dates_valid = dates_valid && (culture.start !== null && culture.end !== null); //Dates are there at all

        //Amalgamate
        return name_vaid && dates_valid && has_period;
    }

    /**
     * Creates a culture out of the modal's state, and appends it to the list of cultures on success.
     */
    addCulture = async () => {
        let culture= this.state.culture;
        delete culture._id; //_id cannot be present when adding new to DB, but will be if editing.
        if(this.validate()) {
            http.post("/cultures", culture)
                .then(resp => {
                    let new_culture = resp.data.new_ent;
                    console.log("Successfully added culture: ", culture)
                    this.props.append_culture(new_culture);
                })
                .then(this.props.on_close)
                .then(this.props.on_success({open:true,type:"success",message:"New Culture successfully added."}))
                .catch(err => console.error("Failed to add new culture: ", err))
        } else {
            console.error("Culture is invalid.")
        }
    }

    /**
     * Edits a culture
     * @return {Promise<void>}
     */
    editCulture = async () => {
        let culture = this.state.culture;
        await http.put(`/cultures/${culture._id}`,culture)
            .then(edited_culture => this.setState({culture:edited_culture}))
            .then(this.props.on_success({open:true,type:"success",message:"Culture successfully edited."}))
            .catch(err => console.error("Failed to edit culture",err))
            .finally(this.props.on_close);
    }


    render(){
        return(
            <div>
                <Dialog open={this.props.open} onClose={this.props.on_close}>
                    <DialogTitle>
                        {this.state.title} Culture
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            id="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={this.state.culture.name}
                            onChange={(e) => this.update_culture("name",e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            id="start_bp"
                            label="start"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={this.state.culture.start}
                            onChange={(e) => this.update_culture("start",e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            id="end_bp"
                            label="end"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={this.state.culture.end}
                            onChange={(e) => this.update_culture("end",e.target.value)}
                        />
                        <TextField
                            select
                            label="Associated Period"
                            value={this.state.culture.period_id}
                            onChange={(e) => this.set_selected_period(e.target.value)}
                            fullWidth
                            margin="dense"
                        >
                            {this.state.periods.length > 0 ? (
                                this.state.periods.map((period) => (
                                    <MenuItem key={period._id} value={period._id}>
                                        {period.name} ({period.start} - {period.end})
                                    </MenuItem>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No periods available. Please create a Period first through the
                                    Manage Periods Tab.
                                </Typography>
                            )}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.on_close} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )}
}

export default CultureModal;
