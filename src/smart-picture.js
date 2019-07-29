import React from 'react';
import './App.css';
import Snackbar from "./snackbar";
import axios from "axios";
import ReactTable from 'react-table'
import Loader from "./loader-ui";


export default class SmartPicture extends  React.Component {
  constructor(props) {
    super(props);
    this.uploadPicture = this.uploadPicture.bind(this);
    this.state = {
      file: null,
      src: '',
      alertMsg: '',
      isAlertActive: false,
      mindeeData: 'no data',
      formatedData : [],
      isLoading: false,
      loaderStroke: loaderColors.none,
      pictureCache: ''
    }
  }
  componentDidMount() {
    console.log('on start, showing this.state:  ', this.state)
  }


  onFileInput=e=>{
    // here reset stuff
    let formData = new FormData();
    if(e.target.files[0]) {
      this.setState({isLoading: false, loaderStroke: loaderColors.none});
      formData.append('file', this.state.file);
      this.showAlertMsg('Nice pic! Now confirm it', ':D', 1000);
      this.setState({
        file: e.target.files[0],
        src: URL.createObjectURL(e.target.files[0]),
        mindeeData: 'no data',
      },  () => {
      });
    } else {
      console.log('user clicked on choose file, then canceled it');
    }
    // console.log('client side received the pic data :  ', e.target.files[0], this.state.src);
  };

  sendToMindee() {
    let options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        "X-Inferuser-Token": "5db86dcf853d7f25823859cb9c0688fa",
      }
    };

    const formData = new FormData();
    formData.append('file', this.state.file, 'yo');
    this.setState({isLoading: true, loaderStroke: loaderColors.progress});
    axios.post("https://infer-73361.mindee.net/main/ocr_receipts/predict", formData, options)
        .then(res => {
          console.log("Res from mindee#########: ", res);
          this.setState({isLoading: false, loaderStroke: loaderColors.success});
          if(res['data'] ) {
            this.setState(prevState => {
              let mindeeData = Object.assign({}, prevState.mindeeData);
              mindeeData = res['data']['predictions'][0];
              return { mindeeData };
            }, () => {this.formatData();})
          }
        })
        .catch((err) => {
          console.log("error...: ", err, ' ...gonna assign hardcoded values...');
          this.setState({
            mindeeData: hardcodedData.predictions[0]
          });
          this.setState({isLoading: false, loaderStroke: loaderColors.fail});
        })
  }

  uploadPicture = () => {
    if(this.state.file && !this.state.isLoading) {
      if(this.state.src === this.state.pictureCache) {
        this.showAlertMsg('I have like a deja vu...', ':/', 1200);
        this.setState({
          loaderStroke: loaderColors.fail,
        });
      } else {
        this.setState({
          pictureCache: this.state.src,
        });
       this.sendToMindee()
      }
    } else if(this.state.isLoading) {
      this.showAlertMsg('already loading...', ';)', 500);
    }
    else {
      this.showAlertMsg('Gimme a picture', ':(', 1000);
    }
  };

  formatData() {
    const data = [];
    console.log('gonna format the data: ', this.state.mindeeData);
    if(this.state.mindeeData !== 'no data') {
      for(let category in this.state.mindeeData ) {
        data.push({name: category});
        for(let attr in this.state.mindeeData[category]) {
          // console.log('attr :', attr, ' val = ', this.state.mindeeData[category][attr])
          data.find(x => x['name'] === category)[attr] = this.state.mindeeData[category][attr]
        }
      }
    }
    console.log('here is the formatted data : ', data);
    this.setState({formatedData: data});
  }

  showAlertMsg(content, smiley, timer) {
    if(!this.state.isAlertActive) {
      this.setState({
        alertMsg: <div>
          <span>{content}</span><span style={{marginLeft: '10px'}}>{smiley}</span>
        </div>,
        isAlertActive: true
      });
    }
    setTimeout(() => {
      this.setState({
        isAlertActive: false
      });
    }, timer);
  }

  render(){
    const columns = [{
      Header: 'Name',
      accessor: 'name'
    }, {
      Header: 'x1',
      accessor: 'coord_x1',
    }, {
      Header: 'x2',
      accessor: 'coord_x2',
    },
      {
        Header: 'y1',
        accessor: 'coord_y1',
      },{
        Header: 'y2',
        accessor: 'coord_y2',
      },
      {
      Header: 'Reliability',
      accessor: 'probability'
    }, {
      Header: 'Value',
      accessor: 'value'
    }];

    return (
        <div className="bigBox">
          <div className="smart-pic-cont">
            <span className="smart-pic-title">SMART PICTURE</span>
              <div className="smart-pic-img-cont">
                <img className="smart-pic-img" src={this.state.src} alt=''/>
                {this.state.src === '' ? 'No image' : ''}
              </div>

              <div className={this.state.mindeeData !== 'no data' ? 'resultCont' : 'hidden'}>
                <ReactTable
                    data={this.state.formatedData}
                    columns={columns}
                />
              </div>

            <div className="btnCont">
              <label htmlFor="picture-uploader" className="button">
                1- Choose a file
              </label>
              <Loader loading={this.state.isLoading} stroke={this.state.loaderStroke}/>
              <input id="picture-uploader" accept="image/png, image/jpeg, image/svg" type="file" name="file"
                     onChange={e => this.onFileInput(e)}/>
              <button className="button" onClick={this.uploadPicture}>2- Show me the magic</button>
            </div>
          </div>
            <Snackbar content={this.state.alertMsg} isActive={this.state.isAlertActive}/>
        </div>
    )
  }
}



const hardcodedData = { "predictions":
      [ { "date": { "coord_x1": 0.586, "coord_x2": 0.678, "coord_y1": 0.067, "coord_y2": 0.078, "probability": 1, "value": "2016-11-01" },
        "gross_salary": { "coord_x1": 0.629, "coord_x2": 0.682, "coord_y1": 0.366, "coord_y2": 0.377, "probability": 1, "value": 3350 },
        "gender": { "coord_x1": 0.829, "coord_x2": 0.882, "coord_y1": 0.566, "coord_y2": 0.577, "probability": 1, "value": "male" },
        "credit card num": { "coord_x1": 0.229, "coord_x2": 0.182, "coord_y1": 0.366, "coord_y2": 0.477, "probability": 1, "value": "937230948234823" },
      } ]};


const loaderColors = {none: '#d0e1f3', progress: '#0c10fa', success:'#47f2b8',  fail: '#ff7555'};
