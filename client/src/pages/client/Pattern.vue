<template>
    <p style="
    font-size: 20px;
    line-height: 23px;
">
        Most machine learning algorithms follow this pattern:
        <ol>
            <li>We have to figure out the
                <b>"features"</b> of the secret formula that generated the data we were given, so that we can learn them. In
                my opinion, this is like 80% of the complexity of solving an ML problem. In this example, we were told the
                shape of the secret formula (it's a cubic!), so the features we have to learn are the coefficients in the
                polynomial. For something more complex like the "is this a dog or a blueberry muffin" problem, we'd have
                to look at pixels and colours and formations and what makes a dog a dog and not a muffin.</li>
            <li>Once we figure out these features (in our case, those
                <code>a,b,c,d</code> coefficients), we initialize them to some random values. We could now use them to make predictions, but
                they would be teeeeeerrible because they're just random.</li>
            <li>(I'm just going to use our actual example from now on and not dogs)</li>
            <li>We start looking at every piece
                <code>(x,y)</code> of training data we were given. We take the
                <code>x</code> value, and based on these coefficients we have estimated, we predict what the
                <code>y</code> value would be. We then look at the correct
                <code>y</code> value from the original training data, calculate the difference between the two, and then adjust our coefficients
                so that our predicted value gets closer to the correct one. </li>
            <li>(this, with more math sprinkled in is called "stochastic gradient descent". "Stochastic" means probabilistic,
                and "gradient descent" should make you think of walking down a hill, towards a sink hole -- the higher the
                hill, the bigger the prediction error, which is why you want to descend towards the error-free hole.)</li>
            <li>This part of code is actually pretty messy (because matrices and derivatives), and TensorFlow does this for us!</li>
            <li>We keep doing this until we use up all the data, and then repeat the entire process so that we iterate over the
                same data over and over again until at the end we've pretty much learnt the coefficients!</li>
        </ol>
    </p>
</template>
<style scoped lang="css">
@import "../../assets/css/style.css";
</style>