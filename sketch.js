function setup() {
    noCanvas();
    const data = tf.tensor([0, 0, 127, 255.01, 100, 50, 20, 30], [2, 2, 2], 'int32');
    const tensor = tf.tensor3d([[[1], [2]], [[3], [4]]]).dataSync();
    // data.print();
    // console.log(data);
    console.log(data.get(0), data.get(1), data.get(2));
    // tf.tensor3d([[[1], [2]], [[3], [4]]]).data().then(stuff => {
    //     console.log(stuff)
    // });

}
const noCanvas = () => { }
setup();
