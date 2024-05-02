export async function quickSort(visualizer, array) {
  async function helper(lo, hi) {
    if (lo >= hi) return;
    let pivot = hi;
    let l = lo;
    let r = hi-1;

    while (l <= r) {
      if (array[l] <= array[pivot]) {
        l += 1;
      } 
      else {
        while (l <= r) {
          if (array[r] >= array[pivot]) {
            r -= 1;
          } else {
            [array[l], array[r]] = [array[r], array[l]];
            l += 1;
            r -= 1;
            visualizer.render(array);
            await new Promise(resolve => setTimeout(resolve, visualizer.getSpeed()));
            break;
          }
        }
      }
    }
    [array[pivot], array[l]] = [array[l], array[pivot]];
    visualizer.render(array);
    await new Promise(resolve => setTimeout(resolve, visualizer.getSpeed()));

    await helper(lo, l-1);
    await helper(l+1, hi);
  }

  visualizer.running();
  await helper(0, array.length-1);
  visualizer.finished();
}