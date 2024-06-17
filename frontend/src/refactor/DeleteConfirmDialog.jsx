import {Component} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

/**
 * Creates a generic delete dialog
 */
class DeleteConfirmDialog extends Component{

    /**
     *
     * @param props
     * @param props.title:String the title of the dialogue
     * @param props.text:String the message to display
     * @param props.on_cancel:Function what to do if deletion is canceled
     * @param props.on_proceed:Function how to perform the deletion
     */
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Dialog open={this.props.open_condition}>
                <DialogTitle id="alert-dialog-title">
                    {/*{`Delete ${this.props.entity_type} ${entity_name}`}*/}
                    {this.props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.on_cancel}>No</Button>
                    <Button onClick={this.props.on_proceed} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default DeleteConfirmDialog;