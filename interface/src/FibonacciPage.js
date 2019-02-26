import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default class App extends Component {
    // State variables
    state = {
        indices: [],
        values: {},
        index: ''
    }

    // Run this as soon as the component renders
    componentDidMount() {
        this.fetchIndices();
        this.fetchValues();
    }

    // Fetch indices from the api/postgres
    fetchIndices() {
        let indices = await axios.get('api/values/indices');
        this.setState({
            indices: indices.data
        });
    }

    // Fetch values from the api/redis
    fetchValues() {
        let values = await axios.get('api/values/all');
        this.setState({
            values: values.data
        });
    }

    // Render indices function
    renderIndices() {
        return this.state.indices.map(({number}) => number).join(', ');
    }

    // Render values function
    renderValues() {
        let domList = [];
        for( let key in this.state.values) {
            domList.push(
                <div key={key}>
                    For index: {key} I calculated {this.state.values[key]}
                </div>
            )
        }

        return domList;
    }

    // handle submit bound function
    handleSubmit = async(event) => {
        let response = await axios.post('api/values/index', {index: this.state.index});
        console.log(response);
        this.setState({index: ''});
    }

    // Render function
    render() {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Enter your index: </label>
                    <input value={this.state.index} onChange={(event) => {this.setState({index: event.target.value})}}></input>
                    <button></button>
                </form>

                <h3>Indices Seen: </h3>
                {this.renderIndices()}

                <h3>Calculated Values: </h3>
                {this.renderValues()}
            </div>
        );
    }
}
