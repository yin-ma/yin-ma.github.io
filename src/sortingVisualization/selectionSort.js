export async function selectionSort(visualizer, array) {
  visualizer.running();

  for (let i=0; i < array.length; i++) {
    let maxIndex = 0;
    for (let j=0; j < array.length-i; j++) {
      if (array[j] > array[maxIndex]) {
        maxIndex = j;
      }
    }
    [array[array.length-1-i], array[maxIndex]] = [array[maxIndex], array[array.length-1-i]];
    visualizer.render(array);
    await new Promise(resolve => setTimeout(resolve, visualizer.getSpeed()));
  }
  visualizer.finished();
}