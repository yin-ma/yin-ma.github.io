export function reset(num) {
  let array = [];
  for (let i=0; i<num; i++) {
    array.push(i+1);
  }
  array = shuffle(array);
  return array;
}

export function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array
}