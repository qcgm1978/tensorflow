<template>
  <div class="Page">
    <header>
        <h1>hello tensorflow
            <div class="glitchButton"></div>
        </h1>
    </header>

    <p>
        <b>Machine Learning (ML) </b> is the dope new thing that everyone's talking about, because it's really good at learning
        from data so that it can predict similar things in the future. Doing ML by hand is pretty annoying since it usually
        involves matrix math which is zero fun in JavaScript (or if you ask me: anywhere 😅). Thankfully,
        <b>
            <a href="https://js.tensorflow.org/">TensorFlow.js</a>
        </b> is here to help! It's an open source library that has a lot of built-in Machine Learning-y things like models and
        algorithms so that you don't have to write them from scratch.
    </p>

    <h2>Is your problem a Machine Learning problem?</h2>
    <p>Machine Learning is good at classifying and labelling data. The premise of every machine learning problem is:
        <ul>
            <li>Someone gives us some data that was generated according to a
                <b>secret</b> formula. This data could be a bunch of points (that are generated based on some math equation),
                but could also be fun, like images (the secret formula could be "some of these images are chihuahuas and
                some are
                <a href="https://mashable.com/2016/03/10/dog-or-muffin-meme/#LjBd4.e9lgqJ">
                    blueberry muffins</a>") or bus schedules.</li>
            <li>By looking at this data we were given, we approximate the secret formula so that we can correctly predict a future
                data point. For example, if we're given a photo, we will eventually be able to confidently say whether it's
                a dog or a muffin.</li>
        </ul>
    </p>


    <h2 id="demo">A fun demo!</h2>
    <p>
        If you want to get started, predicting numbers tends to be easier than predicting images, so in this example we're trying
        to fit a curve to a bunch of data (this is the same example from the
        <a href="https://js.tensorflow.org/tutorials/fit-curve.html">TensorFlow</a> site but with waaaaay more code comments and a prettier graph).
        <br>
        <br> We are given a bunch of points (for
        <code>x</code> between -1 and 1, calculate a
        <code>y</code> according to
        <code>y = a * x^3 + b * x^2 + c * x + d</code> -- we know this is the secret formula but we don't know the values of those
        <code>a,b,c,d</code> coefficients.) Our goal is to learn these coefficients, so that if we're given a new
        <code>x</code> value, we can say what the
        <code>y</code> value should be.</p>

    <p>
        The
        <b>blue</b> dots are the training points we were given. The
        <b>red</b> dots would be our guesses, based on our initial, default coefficients (hella incorrect!). Once you click
        the
        <code>train</code> button, the
        <b>green</b> dots show how our coefficients are getting better. After you see the default example, check what happens
        if you change the shape of the data, or we are given fewer data points or fewer iterations!
    </p>

<Ml/>     
      
       
 
    <h2>How this works</h2>
    

    <h2>The code</h2>
    <p>You can look at the code for the demo
        <a href="https://glitch.com/edit/#!/hello-tensorflow?path=script.js:95:10">here on Glitch</a>. I tried to comment most lines of the code with either what the algorithm or TensorFlow are doing
        (especially when TensorFlow is actually doing a looooot of heavy lifting behind the scenes). I hope it helps!</p>

    <!-- <script src="https://button.glitch.me/button.js"></script> -->

    <div class="footer">
        made by
        <a href="https://twitter.com/notwaldorf">monica</a>, finally putting her degree to use.
    </div>
  </div>
</template>

<script>
import Ml from "./Ml.vue";
export default {
  name: "Formula",
  components: {
    Ml
  }
};
</script>

