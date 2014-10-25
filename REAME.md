
A simple library for generating random pictograms in the browser.

Using
-----

Example: 

    <!DOCTYPE html>
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>Demo of bwflowers</title>
        <script src="js/underscore.js"></script>
        <script src="js/jquery.js"></script>
        <script src="js/mersenne_twister.js"></script>
        <script src="js/bwflowers-bundle.js"></script>
        <style>
            .bwflowers-basic {
                width: 80px;
                height: 80px;
                background-color: #11292a;
                color: white;
                margin: 5px;
            }
        </style>
    </head>
    <body>
        <div class="bwflowers-basic" data-contents-to-hash="variation-asfx"></div>
        <div class="bwflowers-basic" data-contents-to-hash="variation-ffsa"></div>
        <div class="bwflowers-basic" data-contents-to-hash="variation-dfaf"></div>
        <div class="bwflowers-basic" data-contents-to-hash="variation-34as"></div>
        <script>
            $(document).ready(function(){
                bwflowers.assimilate('.bwflowers-basic');
            })
        </script>
    </body>
    </html>

Here is a list of steps that you need to take:

1. Add the dependencies. Those are underscore.js, jquery, and mersenne_twister.js. They are 
   present in this repository, but chances are that your project is already using some of them.
2. Add the library bundle. You can find it at `bundle/bwflowers-bundle.js`
2. Create and style a few elements. This library uses the computed css color and computed css 
   background color of the elements. In the example above, the divs with the class "bwflowers-basic"
   are given a fixed width and height.
3. Add a 'data-contents-to-hash' attribute with a string. A hash of this string will be used to 
   initialize the random number generator, so that you get exactly the same pictogram for the same
   string.
4. Invoke `bwflowers.assimilate` and pass a css selector string for the elements where you want 
   to draw pictograms. 

Build
-----

This is not a npm package yet, but you npm is used to create a basic environment:

    $ npm install

and then do

    $ ./compile.sh

The resulting javascript bundle will be found at `bundle/bwflowers-bundle.js`
