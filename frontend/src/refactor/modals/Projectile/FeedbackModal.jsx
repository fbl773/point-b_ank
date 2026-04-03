import React, { useState, useEffect } from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

/**
@param props.open {boolean}
@param props.type {string} error, info, warning.
@param props.message {string} the message to display
@param props.dismiss {function} dismisses the modal
*/
const FeedbackModal =  (props) => { 

  // Functions / handlers
  const handleClick = () => {
    console.log("Button clicked");
  };


	return (
		<Dialog open={props.open}>
			<DialogTitle id="alert-dialog-title">
				{/*{`Delete ${this.props.entity_type} ${entity_name}`}*/}
				{this.props.title}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{this.props.message}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.props.dismiss}>Ok</Button>
			</DialogActions>
		</Dialog>
	)

}
  
export default ComponentName;
