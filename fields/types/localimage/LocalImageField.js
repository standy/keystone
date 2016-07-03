import Field from '../Field';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, FormField, FormInput, FormNote } from 'elemental';
import urlUtils from 'url';

module.exports = Field.create({

	shouldCollapse () {
		return this.props.collapse && !this.hasExisting();
	},

	fileFieldNode () {
		return ReactDOM.findDOMNode(this.refs.fileField);
	},

	changeFile () {
		this.fileFieldNode().click();
	},

	getFileSource () {
		if (this.hasLocal()) {
			return this.state.localSource;
		} else if (this.hasExisting()) {
			return this.props.value.url;
		} else {
			return null;
		}
	},

	getFileURL () {
		if (!this.hasLocal() && this.hasExisting()) {
			return this.props.value.url;
		}
	},

	undoRemove () {
		this.fileFieldNode().value = '';
		this.setState({
			removeExisting: false,
			localSource: null,
			origin: false,
			action: null,
		});
	},

	fileChanged (event) { // eslint-disable-line no-unused-vars
		this.setState({
			origin: 'local',
		});
	},

	removeFile (e) {
		var state = {
			localSource: null,
			origin: false,
		};

		if (this.hasLocal()) {
			this.fileFieldNode().value = '';
		} else if (this.hasExisting()) {
			state.removeExisting = true;

			if (this.props.autoCleanup) {
				if (e.altKey) {
					state.action = 'reset';
				} else {
					state.action = 'delete';
				}
			} else {
				if (e.altKey) {
					state.action = 'delete';
				} else {
					state.action = 'reset';
				}
			}
		}

		this.setState(state);
	},

	hasLocal () {
		return this.state.origin === 'local';
	},

	hasFile () {
		return this.hasExisting() || this.hasLocal();
	},

	hasExisting () {
		return this.props.value && !!this.props.value.filename;
	},

	getFilename () {
		if (this.hasLocal()) {
			return this.fileFieldNode().value.split('\\').pop();
		} else {
			return this.props.value.filename;
		}
	},

	renderFileDetails (add) {
		var values = null;

		if (this.hasFile() && !this.state.removeExisting) {
			values = (
				<div className="image-values">
					<FormInput noedit className="image-value">{this.props.value.width} x {this.props.value.height}</FormInput>
					<FormInput noedit className="image-value">{this.getImageSource()}</FormInput>
					{add}
				</div>
			);
		}

		return (
			<div key={this.props.path + '_details'} className="image-details">
				<div className="image-container">
					{this.renderImagePreview()}
					{values}
				</div>
			</div>
		);
	},

	renderAlert () {
		if (this.hasLocal()) {
			return (
				<div className="file-values upload-queued">
					<FormInput noedit>File selected - save to upload</FormInput>
				</div>
			);
		} else if (this.state.origin === 'cloudinary') {
			return (
				<div className="file-values select-queued">
					<FormInput noedit>File selected from Cloudinary</FormInput>
				</div>
			);
		} else if (this.state.removeExisting) {
			return (
				<div className="file-values delete-queued">
					<FormInput noedit>File {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm</FormInput>
				</div>
			);
		} else {
			return null;
		}
	},

	renderClearButton () {
		if (this.state.removeExisting) {
			return (
				<Button type="link" onClick={this.undoRemove}>
					Undo Remove
				</Button>
			);
		} else {
			var clearText;
			if (this.hasLocal()) {
				clearText = 'Cancel Upload';
			} else {
				clearText = (this.props.autoCleanup ? 'Delete File' : 'Remove File');
			}
			return (
				<Button type="link-cancel" onClick={this.removeFile}>
					{clearText}
				</Button>
			);
		}
	},

	renderFileField () {
		if (!this.shouldRenderField()) return null;

		return <input ref="fileField" type="file" name={this.props.paths.upload} className="field-upload" onChange={this.fileChanged} tabIndex="-1" />;
	},

	renderFileAction () {
		if (!this.shouldRenderField()) return null;

		return <input type="hidden" name={this.props.paths.action} className="field-action" value={this.state.action} />;
	},

	renderFileToolbar () {
		return (
			<div key={this.props.path + '_toolbar'} className="file-toolbar">
				<div className="u-float-left">
					<Button onClick={this.changeFile}>
						{this.hasFile() ? 'Change' : 'Upload'} Image
					</Button>
					{this.hasFile() && this.renderClearButton()}
				</div>
			</div>
		);
	},

	renderNote () {
		if (!this.props.note) return null;

		return <FormNote note={this.props.note} />;
	},



	getImageSource () {
		if (this.hasLocal()) {
			return this.state.localSource;
		} else if (this.hasExisting()) {
			var value = this.props.value;
			return urlUtils.resolve(this.props.host || '', value.path + value.filename);
// 			return this.props.value.url;
		} else {
			return null;
		}
	},


	/**
	 * Render an image preview
	 */
	renderImagePreview () {
		if (!this.hasExisting()) return <span>No image</span>;
		var value = this.props.value;
		return (
			<div className="img-thumbnail">
				<a href={this.getImageSource()} target="_blank">
					<img key={this.props.path + '_preview_thumbnail'}
					     className="img-load"
					     style={ { height: '90' } }
					     src={this.getImageSource()}
					     title={Math.round(value.size / 1024) + ' Kb'} />
				</a>
			</div>
		);
	},


	renderUI () {
		var container = [];
		var body = [];
		var hasFile = this.hasFile();

		if (this.shouldRenderField()) {
			if (hasFile) {
				container.push(this.renderFileDetails(this.renderAlert()));
			}
			body.push(this.renderFileToolbar());
		} else {
			if (hasFile) {
				container.push(this.renderFileDetails());
			} else {
				container.push(<FormInput noedit>no file</FormInput>);
			}
		}

		return (
			<FormField label={this.props.label} className="field-type-localfile field-type-local field-type-local-image" htmlFor={this.props.path}>

				{this.renderFileField()}
				{this.renderFileAction()}

				<div className="file-container">
					{container}
				</div>
				{body}
				{this.renderNote()}

			</FormField>
		);
	},

});
