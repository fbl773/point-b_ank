import {Component} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {Button} from "@mui/material";
import http from "../../../http.js"
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import DeleteConfirmDialog from "./DeleteConfirmDialog.jsx";


class EditCreateModal extends Component {

    /**
     *
     * @param props
     * @param props.subject {string} the friendly name of the item we are creating/editing
     * @param props.url {string} the api endpoint we will use to perform operations on this entity
     * @param props.adding_new {boolean} true/false is this dialog creating a new entity?
     * @param props.entity {any} the entity we will be creating/editing
     * @param props.open {boolean} true/false is the dialog open?
     * @param props.append_new {Function} a function to update the UI with newly created entities
     * @param props.on_close {Function} a function to close the dialog
     *
     */
    constructor(props) {
        super(props);

        this.state = {
            title:"...",
			feedback:undefined,
            selected:{},
            entity:{
                _id:""
            },
            loaded:false,
            delete_open:false,
			error:false
        }
    }

    //Abstract Methods
    /**
     * Validates the entity being created/edited
     * @abstract
     */
    validate(){}

    /**
     * generates the fields required by the extender
     * @abstract
     */
    render_fields(){ }

	send_alert(details){
		this.setState({feedback:details});

		if(this.props.send_alert)
			this.props.send_alert(details)
	
	}

    //Helpers
    /**
     * Updates the entity sub-object
     * @param key {string} the name of the field to update on the entity
     * @param value {any} the value to update it to
     */
    update_entity(key,_value,error = false){
        let value = _value ?? "";
        let updated_entity= this.state.entity;
        updated_entity[key] = value;
        this.setState({entity:updated_entity, error:error});
    }


    // Actions

    async add_entity(){
        let add_me = this.state.entity;
        delete add_me._id;

        if(this.validate()){
            http.post(this.props.url,add_me)
                .then(resp => {
                    let new_ent = resp.data.new_ent;
                    this.append_new(new_ent);
                })
                .catch(err => {
                    console.error(`Failed to add ${this.props.subject}: `, err)
                    this.send_alert({open:true,type:"error",message:`Failed to add new ${this.props.subject}`})
                })
                .then(this.send_alert({open:true,type:"success",message:`Successfully added new ${this.props.subject}`}))
                .finally(this.props.on_close);

        } else {
            console.error(`${this.props.subject} Invalid!`)
            this.send_alert({open: true, type: "error", message: `Failed to add new ${this.props.subject}.`})
        }
    }

    async edit_entity(){
        let edit_me = this.state.entity;
        if (this.validate()) {
            await http.put(`${this.props.url}/${edit_me._id}`, edit_me)
                .then(edited_ent => this.setState({entity: edited_ent}))
                .then(this.send_alert({open: true, type: "success", message: `${this.props.subject} successfully edited.`}))
                .catch(err => {
                    console.error(`Failed to edit ${this.props.subject}: `, err)
                    this.send_alert({open: true, type: "error", message: `Failed to edit ${this.props.subject}.`})
                })
                .finally(this.props.on_close);
        } else {
            console.error(`${this.props.subject} Invalid!`)
            this.send_alert({open: true, type: "error", message: `failed to edit ${this.props.subject}`})
        }
    }

    async delete_entity(){
      let delete_me = this.state.entity;
      http.delete(`${this.props.url}/${delete_me._id}`)
        .then(_resp => {
          this.props.on_delete(delete_me._id)
          this.send_alert({open: true, type: "success", message: `Successfully deleted ${this.props.subject} - ${delete_me._id}`})
        })
        .catch(err => {
          console.error(``, err)
          this.send_alert({open: true, type: "error", message: `Failed to delete ${this.props.subject} - ${delete_me._id}: `})
        })
        .finally(() => {
          this.setState({delete_open:false})
        });
    }

    //Basics
    componentDidMount() {

        //If we have need to append
        if(this.props.append_new !== undefined){
            this.append_new = this.props.append_new.bind(this);
        }

        //Dynamically configure functionality to fit configured option
        let setLoaded = () => {
          this.setState({ loaded: true });
        }
        if(this.props.adding_new){
            this.handle_submit = this.add_entity.bind(this);
            this.setState({title:"Add"},setLoaded);
        } else {
            this.handle_submit = this.edit_entity.bind(this);
            this.handle_delete = this.delete_entity.bind(this);
            this.setState({title:"Edit",entity:this.props.entity},setLoaded);
        }
    }

    render() {
        return(
            <div >
                {this.state.loaded ?
                <Dialog open={this.props.open} onClose={this.props.on_close} >
                    <DialogTitle>{this.state.title} {this.props.subject}: {this.props.entity?.name ?? ""}</DialogTitle>
                    <DialogContent>
                        {this.state.feedback &&
                            <Alert
                                severity={this.state.feedback.type}
                                onClose={() => this.setState({feedback:undefined})}>
                                {this.state.feedback.message}
                            </Alert>
                        }
                        {this.render_fields()}
                        <DialogActions>
                          {!this.props.adding_new && <Box sx={{flex:1}}>
                                <Button color='error' onClick={() => this.setState({delete_open:true})}>
                                    Delete
                                </Button>
                            </Box>}
                            <Button onClick={this.props.on_close} 
							color="primary">
                                Cancel
                            </Button>
                            <Button 
								onClick={this.handle_submit} 
								disabled = {this.state.error}
								color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>:<CircularProgress/>}
              {!this.props.adding_new && <DeleteConfirmDialog
                  open_condition={this.state.delete_open}
                  title={`Delete ${this.props.subject}-${this.props.entity?.name ?? this.props.entity._id}`}
                  text={`Are you sure you want to delete ${this.props.subject} - ${this.props.entity._id}?`}
                  on_cancel={() => this.setState({delete_open:false})}
                  on_proceed={this.handle_delete}
                  />}
            </div>
        )
    }
}

export default EditCreateModal;
