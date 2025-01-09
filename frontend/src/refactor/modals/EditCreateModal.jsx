import {Component} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {Button} from "@mui/material";
import http from "../../../http.js"


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
     * @param props.send_alert {Function} a function to alert of operation status
     * @param props.on_close {Function} a function to close the dialog
     *
     */
    constructor(props) {
        super(props);

        this.state = {
            title:"...",
            selected:{},
            entity:{
                _id:""
            },
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

    //Helpers
    /**
     * Updates the entity sub-object
     * @param key {string} the name of the field to update on the entity
     * @param value {any} the value to update it to
     */
    update_entity(key,value){
        let updated_entity= this.state.entity;
        updated_entity[key] = value;
        this.setState({entity:updated_entity});
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
                    this.props.send_alert({open:true,type:"error",message:`Failed to add new ${this.props.subject}`})
                })
                .then(this.props.send_alert({open:true,type:"success",message:`Successfully added new ${this.props.subject}`}))
                .finally(this.props.on_close)
        } else {
            console.error(`${this.props.subject} Invalid!`)
            this.props.send_alert({open: true, type: "error", message: `Failed to add new ${this.props.subject}.`})
        }
    }

    async edit_entity(){
        let edit_me = this.state.entity;
        if (this.validate()) {
            await http.put(`${this.props.url}/${edit_me._id}`, edit_me)
                .then(edited_ent => this.setState({entity: edited_ent}))
                .then(this.props.send_alert({open: true, type: "success", message: `${this.props.subject} successfully edited.`}))
                .catch(err => {
                    console.error(`Failed to edit ${this.props.subject}: `, err)
                    this.props.send_alert({open: true, type: "error", message: `Failed to edit ${this.props.subject}.`})
                })
                .finally(this.props.on_close);
        } else {
            console.error(`${this.props.subject} Invalid!`)
            this.props.send_alert({open: true, type: "error", message: `failed to edit ${this.props.subject}`})
        }
    }

    //Basics
    componentDidMount() {

        //If we have need to append
        if(this.props.append_new !== undefined){
            this.append_new = this.props.append_new.bind(this);
        }

        //Dynamically configure functionality to fit configured option
        if(this.props.adding_new){
            this.handle_submit = this.add_entity.bind(this);
            this.setState({title:"Add"});
        } else {
            console.log("And we are trying to edit it...");
            this.handle_submit = this.edit_entity.bind(this);
            this.setState({title:"Edit",entity:this.props.entity});
        }
    }

    render() {
        return(
            <div>
                <Dialog open={this.props.open} onClose={this.props.on_close}>
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

export default EditCreateModal;