
export const insertionSort = (arr) => {

    const tmp_arr = arr.slice();
    const triplets = [];
    triplets.push([0,0,true]); //color 0th bar to 'purple' as there's no element on the left

    for(let i=1; i<tmp_arr.length; i++){
        let j = i;
        if(tmp_arr[j-1] <= tmp_arr[j]){ 
            triplets.push([j, j, true]); // when the current element is greater than the previous we mark it as 'true' -> we just color it with 'purple' 
            continue;
        }

        while(j-1 >= 0 && tmp_arr[j-1] > tmp_arr[j]){
            swap(tmp_arr, j-1, j);
            triplets.push([j-1, j, false]); // when the current element is smaller than the previous mark it as 'false' -> swap color and height of both the bars (j-1 th and jth) 
            j--;
        }
        triplets.push([j, j, true]);  // got the final position for now (not the actual final position)
    }
    return {triplets: triplets, arr: tmp_arr};
}

const swap = (arr, a, b) => {
    const tmp = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;
} 