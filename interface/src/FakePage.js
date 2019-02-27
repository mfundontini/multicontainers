import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Page extends Component {
    render() {
        return (
            <div>
                I am a fake page!
                <Link to='/'>Go to homepage</Link>
            </div>
        );    
    }
}

