import { React, Component } from 'react';
import Slider from '@material-ui/core/Slider';
import { Button } from 'reactstrap';
import { mergeSort } from '../sortingAlgos/mergeSort';
import { quickSort, randomizedQuickSort } from '../sortingAlgos/quickSort';
import { insertionSort } from '../sortingAlgos/insertionSort';
import ReactTooltip from "react-tooltip";
import "tachyons";
import './sortingInterface.css';

import {desc_reset, desc_mergeSort, desc_quickSort, desc_randomQuickSort, desc_insertSort } from '../description/desc_sorting';

class SortInterface extends Component {
    constructor(props) {
        super(props);

        this.state = {
            arr: [],
            isBusy: false,  // it tells us whether any of the sorting algos are running or not
            timePerBar: 10,
            barColor: "Black",
            min_val: 10,
            max_val: 500,
            len: 100,
            bgColor0: "purple",  // the starting color of the bar diagram 
            bgColor1: "Aqua",   // the ending color of the bar
        }
    }


    // re-generates the array
    resetArray() {
        const new_arr = [];

        const min_val = this.state.min_val;
        const max_val = this.state.max_val;
        const len = this.state.len;

        for (var i = 0; i < len; i++) {
            new_arr.push(min_val + Math.floor(Math.random() * (max_val - min_val)));  //random values are stored in the array that fall in the range (1-500)
        }

        this.setState({
            arr: new_arr,  // finally we modify the state
        });

    }


    //the code for handling merge sort animation
    handleMergeSort() {

        const highlight0 = "yellow";
        const highlight1 = "#620037";

        this.setState({
            isBusy: true
        });

        const result = mergeSort(this.state.arr);
        const indexValuePairs = result.indexValuePairs;
        const tmp_arr = result.arr;
        const bars = document.getElementsByClassName("bar");

        indexValuePairs.map((pair, index) => {
            setTimeout(
                () => {
                    if(index > 0){
                        bars[indexValuePairs[index-1][0]].style.backgroundColor = highlight1;
                    }

                    bars[pair[0]].style.height = `${pair[1]}px`;
                    bars[pair[0]].style.backgroundColor = highlight0;

                    if (index === indexValuePairs.length - 1) {
                        this.setState({
                            arr: tmp_arr,
                            isBusy: false,
                        });

                        for (let bar of bars) {
                            bar.style.backgroundColor = this.state.barColor;
                        }
                    }

                }, index * this.state.timePerBar);
        });

    }


    //code for handling quick sort animation
    handleQuickSort(isRandomized) {
        const highlight0 = "#620037";
        const highlight1 = "yellow";

        let result = [];

        if (isRandomized)
            result = randomizedQuickSort(this.state.arr);
        else
            result = quickSort(this.state.arr);

        const swap_triplets = result.swap_triplets;
        const tmp_arr = result.arr;

        const bars = document.getElementsByClassName("bar");

        this.setState({
            isBusy: true
        });

        swap_triplets.map((triplet, index) => {
            setTimeout(() => {
                bars[triplet[0]].style.backgroundColor = highlight1;
                bars[triplet[1]].style.backgroundColor = highlight1;

                if (index > 0) {
                    if (!swap_triplets[index - 1][2]) {
                        bars[swap_triplets[index - 1][0]].style.backgroundColor = this.state.barColor;
                        bars[swap_triplets[index - 1][1]].style.backgroundColor = this.state.barColor;
                    }
                    else if (swap_triplets[index - 1][0] != swap_triplets[index - 1][1])
                        bars[swap_triplets[index - 1][0]].style.backgroundColor = this.state.barColor;

                }

                const height0 = bars[triplet[0]].style.height;
                bars[triplet[0]].style.height = bars[triplet[1]].style.height;
                bars[triplet[1]].style.height = height0;

                if (triplet[2]) {
                    bars[triplet[1]].style.backgroundColor = highlight0;
                }

                if (index === swap_triplets.length - 1) {
                    this.setState({
                        arr: tmp_arr,
                        isBusy: false
                    });

                    for (let bar of bars) {
                        bar.style.backgroundColor = this.state.barColor;
                    }
                }
            }
                , index * this.state.timePerBar
            );
        });
    }



    //code for handling insertion sort animation
    handleInsertionSort() {

        const highlight = "#620037";

        const result = insertionSort(this.state.arr);
        const triplets = result.triplets;
        const tmp_arr = result.arr;

        const bars = document.getElementsByClassName("bar");

        this.setState({
            isBusy: true
        });

        triplets.map((triplet, index) => {
            setTimeout(() => {
                if (triplet[2]) {
                    bars[triplet[0]].style.backgroundColor = highlight;
                }
                else {
                    const tmp_height = bars[triplet[1]].style.height;
                    const tmp_bgColor = bars[triplet[1]].style.backgroundColor;
                    bars[triplet[1]].style.height = bars[triplet[0]].style.height;
                    bars[triplet[1]].style.backgroundColor = bars[triplet[0]].style.backgroundColor;

                    bars[triplet[0]].style.height = tmp_height;
                    bars[triplet[0]].style.backgroundColor = tmp_bgColor;

                }

                if (index === triplets.length - 1) {
                    this.setState({
                        arr: tmp_arr,
                        isBusy: false
                    });

                    for (let bar of bars) {
                        bar.style.backgroundColor = this.state.barColor;
                    }
                }
            }
            , index * this.state.timePerBar)
        });
    }


    // This method is called during the Mounting phase of the React Life-cycle i.e after the component is rendered
    componentDidMount() {  
        this.resetArray();
    }


    //this is the method that heplps in rendering the bars
    renderBars() {
        const bar_seq = this.state.arr.map((value, idx) => {

            return (
                <div key={idx} >
                    <div data-tip="" data-for={"tootip-" + idx} className="bar " style={
                        {
                            width: `${89 * 0.7 / this.state.arr.length}vw`,
                            backgroundColor: this.state.barColor,
                            marginLeft: `${89 * 0.3 / this.state.arr.length}vw`,
                            height: `${value}px`,
                            marginTop: "10px"

                        }
                    } ></div>
                    <ReactTooltip className='myClass' id={"tootip-" + idx} effect="float" border="true" delayShow={100}>{this.state.isBusy ? "wait" : value} </ReactTooltip>
                </div>
            );
        });



        return (
            <div className="col-12 col-md-11 border d-flex flex-wrap align-items-end justify-content-center"
                style={{
                    "background-image": `linear-gradient(to bottom right, ${this.state.bgColor0}, ${this.state.bgColor1})`,
                    height: `${this.state.max_val + 50}px`
                }}>
                {bar_seq}
            </div>
        );
    }



    // this methdo gets executed when the value of the speed is modified
    onSpeedChange(value) {
        const time = 400 / value;  // the lesser the 'value' will be, the more the time each bar will get
        this.setState({
            timePerBar: time
        });
    }


    //this method gets executed when the number of bars is modified
    onBarCountChange(value) {
        this.state.len = value;
        this.resetArray();
    }



    render() {
        return (
            <div>
                {/* this is where we render the bar diagram */}
                <div className="row bg-near-black justify-content-center"> {/* 'row' provides some space before the bar diagram*/}
                    <hr />
                    {this.renderBars()}
                </div>

                {/* here we have the buttons and controllers together*/}
                <div className="row d-flex justify-content-center align-items-center bg-navy">
                    {/* buttons and their descriptions*/}
                    <div className="col-8 col-md-6 " style={{fontFamily: "jasmine", fontStyle: "bold"}}>
                        {/* we disable the buttons when the state is busy */}
                        <Button data-tip={desc_reset} data-for="tip-reset" id="btn-reset" className="ma1 grow dib bw2 shadow-5" color="primary" disabled={this.state.isBusy} onClick={() => this.resetArray()}>Reset Array</Button>{' '}
                        <Button data-tip={desc_mergeSort} data-for="tip-merge" id="btn-mergeSort" className="ma1 grow dib bw2 shadow-5" color="success" disabled={this.state.isBusy} onClick={() => this.handleMergeSort()}>Merge Sort</Button>{' '}
                        <Button data-tip={desc_quickSort} data-for="tip-quick" id="btn-quickSort" className="ma1 grow dib bw2 shadow-5" color="success" disabled={this.state.isBusy} onClick={() => this.handleQuickSort(false)}>Quick Sort</Button>{' '}
                        <Button data-tip={desc_randomQuickSort} data-for="tip-random-merge" id="btn-randQuickSort" className="ma1 grow dib bw2 shadow-5" color="success" disabled={this.state.isBusy} onClick={() => this.handleQuickSort(true)}>Randomized Quick Sort</Button>{' '}
                        <Button data-tip={desc_insertSort} data-for="tip-insertion" id="btn-insertSort" className="ma1 grow dib bw2 shadow-5" color="success" disabled={this.state.isBusy} onClick={() => this.handleInsertionSort()}>Insertion Sort</Button>{' '}

                        {/* here, the descriptions of each button is handled */}
                        <ReactTooltip className='myClass' id="tip-reset" effect="float" border="true" html={true} delayShow={200}>{desc_reset} </ReactTooltip>
                        <ReactTooltip className='myClass' id="tip-merge" effect="float" border="true" html={true} delayShow={200}>{desc_mergeSort}</ReactTooltip>
                        <ReactTooltip className='myClass' id="tip-quick" effect="float" border="true" html={true} delayShow={200}>{desc_quickSort}</ReactTooltip>
                        <ReactTooltip className='myClass' id="tip-random-merge" effect="float" border="true" html={true} delayShow={200}>{desc_randomQuickSort}</ReactTooltip>
                        <ReactTooltip className='myClass' id="tip-insertion" effect="float" border="true" html={true} delayShow={200}>{desc_insertSort}</ReactTooltip>
                    </div>

                    {/* here we have the controllers */}
                    <div className="grow bg-aqua shadow b ba ma3 col-6 col-md-4 justify-content-center mt-3">
                        <p style={{fontFamily: "jasmine", fontStyle: "bold"}}>Speed </p>
                        <Slider
                            defaultValue={50}
                            aria-labelledby="speed"
                            min={5}
                            max={100}
                            valueLabelDisplay="auto"
                            onChange={(event, value) => {
                                this.onSpeedChange(value);
                            }}
                            disabled={this.state.isBusy}
                        />
                        
                        <p style={{fontFamily: "jasmine", fontStyle: "bold"}}>Number of bars </p>
                        <Slider
                            defaultValue={100}
                            aria-labelledby="Bars"
                            min={20}
                            max={200}
                            valueLabelDisplay="auto"
                            onChange={(event, value) => {
                                this.onBarCountChange(value);
                            }}
                            disabled={this.state.isBusy}
                        />
                        <br /> <br />
                    </div>
                </div>
            </div>
        );
    }
}

export default SortInterface;