import React, {Component} from 'react';
import { withActions } from 'react-router-dispatcher';
import metadataAction from 'react-router-dispatcher-metadata';

class NotFound extends Component {

  static getMetadata(/*match, props*/) {
    return {
      title: 'Page Not Found'
    };
  }

  render() {
    return (
      <div>
        <h1>Page Not Found</h1>
      </div>
    );
  }
}

export default withActions(metadataAction())(NotFound);
