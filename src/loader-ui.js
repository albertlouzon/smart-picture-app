
import React from 'react';
import './App.css';


export default class Loader extends  React.Component {
constructor(props) {
super(props);
this.loading = this.props.loading;
this.stroke = this.props.stroke;

// this.onFileInput = this.onFileInput.bind(this);
this.state = {
    toggleClass: 'loader',
}

}

    componentWillUpdate(nextProps, nextState, nextContext) {
    console.log('Will update : ', nextProps, ' vs curent value of props : ', this.props.loading );
    if(this.props.loading !== nextProps['loading']) {
        this.setState({
            toggleClass: nextProps['loading'] ? 'loader animation-circle' : 'loader',
        })
    }
}
componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log('DID update. prevProps : ', prevProps, '  prevState: ', prevState, '  snapshot:  ', snapshot );
}

    render(){
return (
    <div className="">
        <svg id="progress-circle" className={this.state.toggleClass} viewBox="0 0 50 50">
        <circle stroke={this.props.stroke} className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="8.3" />
        </svg>
    </div>

    )
}
}


