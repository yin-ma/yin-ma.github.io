export async function mergeSort(visualizer, array) {
  async function merge(l1, l2, r1, r2) {
    let res = [];
    let l = l1;
    let r = r1;
    while (l <= l2 && r <= r2) {
      if (array[l] <= array[r]) {
        res.push(array[l]);
        l += 1;
      } 
      else {
        res.push(array[r]);
        r += 1;
      }
    }

    if (l <= l2) {
      for (let i=l; i < l2+1; i++) {
        res.push(array[i]);
      } 
    } else {
      for (let i=r; i < r2+1; i++) {
        res.push(array[i]);
      }
    }
    return res;
  }

  async function helper(l, r) {
    if (l >= r) return;
    let mid = Math.floor((l+r) / 2);
    await helper(l, mid);
    await helper(mid+1, r);
    let temp = await merge(l, mid, mid+1, r);
    let idx = 0;
    for (let i = l; i < r+1; i++) {
      array[i] = temp[idx];
      idx += 1;
      visualizer.render(array);
      await new Promise(resolve => setTimeout(resolve, visualizer.getSpeed()));
    }
  }

  visualizer.running();
  await helper(0, array.length-1);
  visualizer.finished();
}