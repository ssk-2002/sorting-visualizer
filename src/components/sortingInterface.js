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
            timePerBar: 50,
            barColor: "Black",
            min_val: 10,
            max_val: 500,
            len: 100,
            bgColor0: "purple",  // the starting color of the bar diagram 
            bgColor1: "Aqua",   // the ending color of the bar diagram
        }
    }




    /* RESET ARRAY: Creates a new array of size 'len' with random values for the given range
    -> At the end we update the state
    */
    resetArray() {
        const new_arr = [];

        const min_val = this.state.min_val;
        const max_val = this.state.max_val;
        const len = this.state.len;

        for (var i = 0; i < len; i++) {
            new_arr.push(min_val + Math.floor(Math.random() * (max_val - min_val)));  //random values are stored in the array that fall in the range (1-500)  -> Math.random() generates a value from 0.0 to 1.0
        }

        this.setState({
            arr: new_arr,  // finally we modify the state with the newly generated array
        }); 

    }




    /* MERGE SORT: First we perform normal merge sort, that retuns a final sorted array, and an array of 'index-value' pairs

    -> The 'index-value' pairs store all the indices with their modified value for a particular round, that means- 
       for a single index, the number of times its value gets updated we store all the records, so that instead of showing the final 
       array directly we can display it round by round -> one index will appear more than once with different value
    -> We use two different colors - 'yellow' for denoting the current bar, and 'purple' for bars 'processed atleast once'. That's why we 
       don't change the BG color when we are at the first index as nothing is processed before it.
    -> The moment we are in the last index, we update the state and set the color of all the bar to 'black'
    -> The setTimeout() method executes a block of code after the specified time -> index * this.state.timePerBar

    HOW IS THE ANIMATION HANDLED?
    While performing the normal merge-sort, we store all the indices along with their modified value of that round, and using that we 
    can highlight the current bar we are working on, and also modify its value with its 'final value so far'. 

    NOTE: Use console.log(indexValuePair) to see what it contains basically
    */
    handleMergeSort() {

        const currentBar = "yellow";
        const processedBars = "#620037";

        this.setState({
            isBusy: true
        });

        const result = mergeSort(this.state.arr);
        const indexValuePairs = result.indexValuePairs;
        const tmp_arr = result.arr;
        const bars = document.getElementsByClassName("bar");
        // console.log(indexValuePairs);

        indexValuePairs.map((pair, index) => {
            setTimeout(   
                () => { 
                    if(index > 0){
                        bars[indexValuePairs[index-1][0]].style.backgroundColor = processedBars;
                    } 

                    // change the height of the current bar (pair[0] index) by the value of pair[1] and also change the color to 'yellow'-> that tells in which bar we are working currently 
                    bars[pair[0]].style.height = `${pair[1]}px`;  
                    bars[pair[0]].style.backgroundColor = currentBar; 

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






    /*QUICK SORT: Here first we perform quick-sort, that returns a triplet that contains - two indices whose values are swapped at 
    a time (as we know we do swapping when we get a smaller value than pivot) and a bool value that tells whether a it was a pivot element or not.

    -> First we highlight (by 'yellow') the current bars -> may be a single bar sometimes
    -> Set the colors of the previous bars 'black' (if it is not a pivot element) -> but if it was a pivot element we check whether 
       the swapped indices are same or not -> If they are same we don't do anything, otherwise we change the color of the first index (non-pivot)
    -> For the current two bars, we swap the heights and if it is a pivot we change its color to 'purple'

    RANDOMIZED: To apply the 'Randomized Quick Sort' we only generate the pivot-index randomly for the range, and rest of the thungs remains same 

    HOW IS THE ANIMATION HANDLED? 
    When we perform the normal quick-sort we store all the pair of indices that are swapped, that gives us an way to access the bars 
    that are currently in use, so we highlight them. ANd also we store a bool value, that tells whether it was a pivot element or not. 
    If it was pivot that means it has got its final position, so we can mark this bar with a different color, and it should not get modified again.
    The moment we are done swapping a pair (non-pivot), we change the colors to black again, because they are not yet in their final position

    NOTE: Use console.log(swap_triplets) to see what are stored in 'swap_triplets' 
    */
    handleQuickSort(isRandomized) {
        const processedBars = "#620037";  // the pivots are basically colored with this color
        const currentBar = "yellow";

        let result = [];

        // check whether we need to perform normal quick-sort, Or randomized one
        if (isRandomized) result = randomizedQuickSort(this.state.arr);
        else result = quickSort(this.state.arr);

        const swap_triplets = result.swap_triplets;
        const tmp_arr = result.arr; 

        const bars = document.getElementsByClassName("bar");
        // console.log(swap_triplets);

        this.setState({
            isBusy: true
        });

        swap_triplets.map((triplet, index) => {
            setTimeout(() => {
                // set the two bars' color to 'yellow' that means we are wokring on them -> we can have one single bar also sometimes -> in that case only one bar gets highlighted
                bars[triplet[0]].style.backgroundColor = currentBar;
                bars[triplet[1]].style.backgroundColor = currentBar;

                // change previous bars' colors to 'black' (except pivot)
                if (index > 0) {
                    if (!swap_triplets[index - 1][2]) {
                        bars[swap_triplets[index - 1][0]].style.backgroundColor = this.state.barColor;
                        bars[swap_triplets[index - 1][1]].style.backgroundColor = this.state.barColor;
                    }
                    else if (swap_triplets[index - 1][0] != swap_triplets[index - 1][1])
                        bars[swap_triplets[index - 1][0]].style.backgroundColor = this.state.barColor;
                }

                // swap heights
                const height0 = bars[triplet[0]].style.height;
                bars[triplet[0]].style.height = bars[triplet[1]].style.height;
                bars[triplet[1]].style.height = height0;

                // if pivot, change color to 'purple' -> 2nd index is for the pivot -> triplet[1]
                if (triplet[2]) {
                    bars[triplet[1]].style.backgroundColor = processedBars;
                }

                // the moment when we reach the end, we update the states
                if (index === swap_triplets.length - 1) {
                    this.setState({
                        arr: tmp_arr,
                        isBusy: false
                    });

                    for (let bar of bars) {
                        bar.style.backgroundColor = this.state.barColor;
                    }
                }
            } , index * this.state.timePerBar);
        });
    }





    /*INSERTION SORT: We apply the normal isertion sort, in addition we store triplets each time that contains -
    -> For the first bar, it contains {0,0,true}, that means - for the 0-th bar we color it with 'purple' and don;t make any other comparison (that we do in insertion sort)
    -> The bar which is greater than the previous bar, we again mark it as 'true' as nothing will be swapped and store same indices ( as nothing is swapped )
    -> Otherwise, when we perform swapping, we store all the indices that are swapped and also store 'false' as it has still possibility to get swapped
    -> Finally when we come out of the while loop (when we get a valid position for the current element) we mark it as 'true' and store same indices (as no other swaps will be there for now)


    HOW IS THE ANIMATION HANDLED?
    Hence we store all the swapped indices along with their states (true/false) we get to know - how the coloring should be handled. 
    The coloring concept is alrready explained above!
    */
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
                    // swap the colors and heights
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



    // RESET ARRAY WHEN COMPONENT IS RENDERED: This method is called during the Mounting phase of the React Life-cycle i.e after the component is rendered
    componentDidMount() {  
        this.resetArray();
    }



    // CREATE THE BARS WITH THE ARRAY: this is the method that heplps in rendering the bars
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



    // CHANGE SPEED: this methdo gets executed when the value of the speed is modified
    onSpeedChange(value) {
        const time = 400 / value;  // the lesser the 'value' will be, the more the time each bar will get
        this.setState({
            timePerBar: time
        });
    }


    // CHANGE NUMBER OF BARS: this method gets executed when the number of bars is modified
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