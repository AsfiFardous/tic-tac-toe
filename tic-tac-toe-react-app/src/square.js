import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Button from 'react-bootstrap/Button';

class Square extends React.Component {

    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                <span style={{ 'color': this.props.value === 'X' ? 'blue' : 'black' }}>{this.props.value}</span>
            </button>
        )
    };
}

export default Square; 