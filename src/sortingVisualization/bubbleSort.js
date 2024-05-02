export async function bubbleSort(visualizer, array) {
  visualizer.running();
  for (let i = 0; i < array.length; i++) {
    let swapped = false;
    for (let j = 1; j < array.length - i; j++) {
      if (array[j] < array[j - 1]) {
        [array[j], array[j - 1]] = [array[j - 1], array[j]];
        swapped = true;
      }
      visualizer.render(array);
      await new Promise(resolve => setTimeout(resolve, visualizer.getSpeed()));
    }
    if (!swapped) {
      break;
    }
  }
  visualizer.finished();
}
